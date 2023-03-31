import * as vscode from 'vscode';
import * as https from 'http';

export function activate(context: vscode.ExtensionContext) {

	//さくらスクリプトをHTTPで送る
	let disposable = vscode.commands.registerCommand('sstpsender.send', () => {

		//送信先
		const url = "http://127.0.0.1:9801/api/sstp/v1";

		//テキストを取得して送る
		const editor = vscode.window.activeTextEditor;
		let script = editor?.document.getText(editor?.selection);
		if(script == "" || script == null)
			return;

		//改行コードを除去
		script = script.replace(/\r?\n/g, '');

		//SSTPを作成
		const sstp = `SEND SSTP/1.0\r\nCharset: UTF-8\r\nSender: sss\r\nSecurityLevel: Local\r\nScript: ${script}\r\n\r\n`;

		//Content-Lengthが無いと認識しないのでサイズ計算の意味も含めてBufferにする
		const buffer = Buffer.from(sstp, 'utf-8');
		
		//送信
		const options = {
			method: "POST",
			headers: {
				"Content-Type": "text/plain;charset=utf-8",
				"Content-Length": buffer.length
			},
			
		};

		const request = https.request(url, options, res => {
			//console.log(`statusCode: ${res.statusCode}`);
			res.on('data', chunk => {
				//console.log(`data: ${chunk}`);
			});
		});
		request.write(buffer, "utf-8");
		request.end();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
