"""
生成关卡 9 的挑战图片
一张带 EXIF Comment 的简单风景图
"""
from PIL import Image
import piexif
import os

# 创建一张简单的渐变图（500x300）
img = Image.new('RGB', (500, 300))
pixels = img.load()
for x in range(500):
    for y in range(300):
        # 蓝天到绿地的渐变
        r = int(100 + x * 0.1)
        g = int(150 + y * 0.2)
        b = int(200 - y * 0.3)
        pixels[x, y] = (min(r, 255), min(g, 255), max(b, 50))

# 在图片上画一些简单的"山"
for x in range(500):
    for y in range(300):
        if y > 200 - int(50 * (1 - ((x - 250) / 250) ** 2)):
            r, g, b = pixels[x, y]
            pixels[x, y] = (min(r + 30, 255), min(g + 50, 255), min(b + 20, 255))

# 添加文字
from PIL import ImageDraw, ImageFont
draw = ImageDraw.Draw(img)
# 使用默认字体
draw.text((20, 260), "Eclipse's Travel Photo #2024", fill=(255, 255, 255))
draw.text((20, 275), "Beautiful day at the mountains!", fill=(200, 200, 200))

# 保存图片（先用无 EXIF 的方式）
img.save('temp.jpg', 'JPEG', quality=85)

# 添加 EXIF 数据
exif_dict = {
    '0th': {
        piexif.ImageIFD.Make: 'Canon',
        piexif.ImageIFD.Model: 'EOS 5D Mark IV',
        piexif.ImageIFD.Software: 'Adobe Photoshop 2024',
        piexif.ImageIFD.Artist: 'Eclipse',
    },
    'Exif': {
        piexif.ExifIFD.DateTimeOriginal: '2024:07:15 14:30:00',
        piexif.ExifIFD.UserComment: b'ASCII\x00\x00\x00flag{h1dd3n_1n_pla1n_s1ght}',
        # 👆 flag 藏在 UserComment 字段中
    },
}

exif_bytes = piexif.dump(exif_dict)

# 重新保存带 EXIF 的图片
img.save('temp.jpg', 'JPEG', quality=85, exif=exif_bytes)

# 移动到 public/challenges/
os.makedirs('../public/challenges', exist_ok=True)
os.rename('temp.jpg', '../public/challenges/challenge-09.jpg')

print('✅ challenge-09.jpg 已生成！')
print('   flag 藏在 EXIF UserComment 字段中: flag{h1dd3n_1n_pla1n_s1ght}')