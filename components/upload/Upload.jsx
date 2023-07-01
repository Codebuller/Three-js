import { ChangeEvent, useState } from 'react';

function Upload({rebuildTxt,rebuildImg}) {
  
  const [file, setFile] = useState();

  const handleFileChangeTxt = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      rebuildTxt(e.target.files[0]);
    }
   
  };
  const handleFileChangeImg = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      rebuildImg(e.target.files[0]);
    }
   
  };
  return (
    <div>
      
      <h3>Upload text-format</h3>
      <input  type="file" onChange={(e)=>{handleFileChangeTxt(e)}} />

      <div>{file && `${file.name} - ${file.type}`}</div>
      {/* <h3>Pictures</h3>
      <input  type="file" onChange={(e)=>{handleFileChangeImg(e)}} />
      
      <div>{file && `${file.name} - ${file.type}`}</div> */}
    {/* 
    Загрузить фото и расспарсить его по пикселям можно, но 1)Это большая нагрузка 2)Качество, чем оно лучше тем больше нагрузка)) 
    Я решил не добавлять эту фичу, хотя идея была интересная, но можно просто добавить объект и наложить на него текстурку фото и тд, 
    что не будет вызывать столько проблем, но тогда не будет работать raycaster нормально, вообщем эта фича здесь не нужна.
      */}
    </div>
  );
}

export default Upload;