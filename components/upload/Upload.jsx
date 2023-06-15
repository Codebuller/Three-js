import { ChangeEvent, useState } from 'react';

function Upload({rebuild}) {
  
  const [file, setFile] = useState();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      rebuild(e.target.files[0]);
    }
   
  };
  return (
    <div>
      <input  type="file" onChange={(e)=>{handleFileChange(e)}} />

      <div>{file && `${file.name} - ${file.type}`}</div>
    </div>
  );
}

export default Upload;