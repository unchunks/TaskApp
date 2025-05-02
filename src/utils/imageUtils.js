/**
 * 画像ファイルを読み込んで、最大幅・高さを指定してリサイズ・JPEG圧縮を行い、Base64データとして返す関数
 * 
 * @param {File} file - ユーザーが選択した画像ファイル（Fileオブジェクト）
 * @returns {Promise<string>} - 圧縮済み画像のBase64形式のデータURL（JPEG）
 */
export const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader(); // ファイル読み込み用のFileReaderを作成

    // ファイル読み込みが完了したときに呼ばれるイベント
    reader.onload = (e) => {
      const img = new Image(); // 読み込んだ画像データをImageオブジェクトに変換

      // 画像の読み込みが完了したときの処理
      img.onload = () => {
        const canvas = document.createElement('canvas'); // 描画用のcanvas要素を作成

        // スマホ画面でも見やすくするための最大幅・高さ（フルHD未満程度）
        const maxWidth = 1080;
        const maxHeight = 1080;

        // 元画像のサイズを取得
        let width = img.width;
        let height = img.height;

        // 画像のアスペクト比を保ったままリサイズ（長辺を最大1080に抑える）
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        // canvasのサイズを設定して、リサイズ後の画像を描画
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height); // canvasに画像を描画

        // canvasからJPEG形式で画像を取り出し、品質80%で圧縮
        const quality = 0.8; // 圧縮率（0〜1の範囲）
        resolve(canvas.toDataURL('image/jpeg', quality)); // 圧縮画像のBase64データを返す
      };

      // 読み込んだデータ（Base64形式）を画像ソースとして設定
      img.src = e.target.result;
    };

    // 画像ファイルをBase64形式で読み込む
    reader.readAsDataURL(file);
  });
};
