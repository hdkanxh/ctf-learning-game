"""
生成关卡 10 的 LSB 隐写图片
在 PNG 像素的最低位中隐藏 flag
"""
from PIL import Image
import os

# 创建一张彩色噪声图（用噪声掩盖 LSB 修改）
import random
random.seed(42)

img = Image.new('RGB', (400, 200))
pixels = img.load()

# 填充随机颜色（但保证美观）
for x in range(400):
    for y in range(200):
        r = random.randint(100, 200)
        g = random.randint(100, 200)
        b = random.randint(100, 200)
        pixels[x, y] = (r, g, b)

# 在图片中央画一个简单的几何图案（让图片看起来"有意义"）
for x in range(100, 300):
    for y in range(50, 150):
        # 画一个渐变圆
        dx = (x - 200) / 120
        dy = (y - 100) / 80
        dist = (dx**2 + dy**2) ** 0.5
        if dist < 1:
            alpha = 1 - dist
            r, g, b = pixels[x, y]
            pixels[x, y] = (
                int(r * (1 - alpha) + 255 * alpha),
                int(g * (1 - alpha) + 200 * alpha),
                int(b * (1 - alpha) + 100 * alpha),
            )

# LSB 隐写：将 flag 的每个 bit 写入像素的最低位
message = "flag{lsb_st3g4n0gr4phy}"
bits = ''.join(format(ord(c), '08b') for c in message)

# 写入像素
bit_idx = 0
for x in range(img.width):
    for y in range(img.height):
        if bit_idx >= len(bits):
            break
        r, g, b = pixels[x, y]
        # 修改 R 通道的 LSB
        r = (r & 0xFE) | int(bits[bit_idx])
        bit_idx += 1
        if bit_idx < len(bits):
            g = (g & 0xFE) | int(bits[bit_idx])
            bit_idx += 1
        if bit_idx < len(bits):
            b = (b & 0xFE) | int(bits[bit_idx])
            bit_idx += 1
        pixels[x, y] = (r, g, b)
    if bit_idx >= len(bits):
        break

# 保存
os.makedirs('../public/challenges', exist_ok=True)
img.save('../public/challenges/challenge-10.png', 'PNG')

print('✅ challenge-10.png 已生成！')
print(f'   LSB 中隐藏的信息: {message}')
print(f'   总共 {len(bits)} bits，需要 {len(bits) // 3} 个像素')

# 验证：读取并提取 LSB
verify_img = Image.open('../public/challenges/challenge-10.png')
verify_pixels = verify_img.load()
extracted_bits = ''
for x in range(verify_img.width):
    for y in range(verify_img.height):
        if len(extracted_bits) >= len(bits):
            break
        r, g, b = verify_pixels[x, y]
        extracted_bits += str(r & 1)
        if len(extracted_bits) < len(bits):
            extracted_bits += str(g & 1)
        if len(extracted_bits) < len(bits):
            extracted_bits += str(b & 1)
    if len(extracted_bits) >= len(bits):
        break

extracted_bytes = []
for i in range(0, len(extracted_bits), 8):
    byte = extracted_bits[i:i+8]
    if len(byte) == 8:
        extracted_bytes.append(chr(int(byte, 2)))

print(f'   验证提取: {"".join(extracted_bytes)}')