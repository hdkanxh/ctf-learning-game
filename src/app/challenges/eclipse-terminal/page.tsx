'use client';

import { useState } from 'react';

export default function EclipseTerminalPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [terminalInput, setTerminalInput] = useState('');

  const handleLogin = () => {
    if (username === 'eclipse_admin' && password === 'th3_3cl1ps3_r1s1ng') {
      setLoggedIn(true);
      setTerminalOutput([
        '=== Eclipse Remote Terminal v1.0 ===',
        'Authentication successful.',
        '',
        '[System] Incoming encrypted message:',
        'aedidnz_kofnoeaybco_dclar_',
        '',
        '[Hint] Rail fence cipher, 4 rails',
        '[Hint] Decrypt and follow the instruction',
        '',
        '$ _',
      ]);
    } else {
      setError('Authentication failed. Hint: Check the page source.');
    }
  };

  const handleTerminalCommand = () => {
    const cmd = terminalInput.trim();

    const backdoorCommands = ['activate_backdoor_555'];
    const downloadCommands = ['analyze_backdoor_find_code'];

    const newOutput = [...terminalOutput, `$ ${cmd}`];

    if (backdoorCommands.includes(cmd)) {
      newOutput.push('');
      newOutput.push('[Backdoor] Activated. Extracting hidden data...');
      newOutput.push('[Backdoor] Done.');
      newOutput.push('');
      newOutput.push('Download location image: /challenges/challenge-21.png');
      newOutput.push('Hint: Use LSB tool to extract the final coordinates.');
      newOutput.push('');
      newOutput.push('--- Session ended ---');
    } else if (downloadCommands.includes(cmd)) {
      newOutput.push('');
      newOutput.push('[System] Authorized. Download backdoor source:');
      newOutput.push('  /challenges/challenge-21.c');
      newOutput.push('');
      newOutput.push('Hint: Use Strings tool to find the activation code.');
    } else if (cmd === 'help') {
      newOutput.push('Commands: help, whoami, ls, cat readme.txt, exit');
    } else if (cmd === 'whoami') {
      newOutput.push('eclipse@server:~$');
    } else if (cmd === 'ls') {
      newOutput.push('backdoor.bin  readme.txt');
    } else if (cmd === 'cat readme.txt') {
      newOutput.push('Backdoor v2.1 - activation code required.');
      newOutput.push('The code is embedded in the binary. Use strings to extract it.');
    } else if (cmd === 'exit') {
      newOutput.push('Connection closed.');
    } else {
      newOutput.push(`Command not found: ${cmd}`);
      newOutput.push('Type help for available commands.');
    }

    setTerminalOutput(newOutput);
    setTerminalInput('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-white mb-6">Eclipse Remote Terminal</h1>

        {!loggedIn ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-lg text-white mb-4">Authentication Required</h2>

            <div dangerouslySetInnerHTML={{
              __html: '<!--\n              Admin credentials:\n              Username: eclipse_admin\n              Password: th3_3cl1ps3_r1s1ng\n              (DELETE THIS COMMENT!!! - Eclipse)\n            -->'
            }} />

            <div className="space-y-3">
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Username" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-green-400 focus:border-green-500 outline-none" />
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password" className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-green-400 focus:border-green-500 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
              <button onClick={handleLogin}
                className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded transition-colors">
                Login
              </button>
              {error && <p className="text-red-400 text-sm">{error}</p>}
            </div>
          </div>
        ) : (
          <div className="bg-black border border-green-700 rounded-lg p-4">
            <div className="h-96 overflow-y-auto mb-4 text-sm leading-relaxed">
              {terminalOutput.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">
                  {line.startsWith('  /challenges/') || line.startsWith('Download') ? (
                    <a href={line.replace('  ', '').replace('Download location image: ', '')} download className="text-blue-400 hover:text-blue-300 underline">
                      {line}
                    </a>
                  ) : (
                    line
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <span className="text-green-500">$</span>
              <input type="text" value={terminalInput}
                onChange={(e) => setTerminalInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTerminalCommand()}
                className="flex-1 bg-transparent border-none outline-none text-green-400"
                placeholder="Enter command..." autoFocus />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
