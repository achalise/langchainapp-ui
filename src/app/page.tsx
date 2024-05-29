"use client"
import { useRef, useState } from "react"

export default function Chat() {
  const ref = useRef();
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [file, setFile] = useState<any>({});
  const [fileUploadMsg, setFileUploadMsg] = useState<string>("");

  const upload = () => {
    const url = 'http://localhost:8080/upload';
    const formData = new FormData();
    //data.append("file", file, file.name);
    formData.append("file", file);

    fetch(url, {
      method: 'POST',
      // headers: {
      //   "Content-Type": "multipart/mixed"
      // },
      body: formData
    })
      .then(response => response.json())
      .then(result => {
        // Handle the response/result here
        console.log(result);
        setFileUploadMsg("File uploaded successfully");
        setTimeout(() => {
          setFileUploadMsg("");
        }, 4000)
        ref.current.value = "";
      })
      .catch(error => {
        // Handle any error that occurs during the request
        console.error(error);
        setFileUploadMsg("Error");
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`Submitted request`);
    setResponse((r) => {
      return "Please wait retrieving response ..."
    })
    const response = await fetch(`http://localhost:8080/chat?question=${message}`);
    const content = await response.text();
    setResponse(content);
    console.log(content);
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  }
  const selectFile = (e: any) => {
    setFile(e.target.files[0]);
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <section className='chatbot-section flex flex-col origin:w-[800px] w-full origin:h-[735px] h-full rounded-md p-2 md:p-6'>
        <div className="mb-3">
          <label className="form-label">Please select file for RAG query:</label>
          <input className="form-control" type="file" id="formFile" ref={ref} onChange={selectFile} />
          <button type="button" className="btn btn-dark mt-3 mb-3" onClick={upload}>Upload</button>
        </div>
        <div className="mb-3">
          <p onClick={() => setFileUploadMsg("")}>{fileUploadMsg} </p>
        </div>
        <div className='chatbot-header pb-6'>
          <div className='flex justify-between'>
            A simple RAG application using LangChain4J in the backend
          </div>
        </div>
        <div className='flex-1 relative overflow-y-auto my-4 md:my-6'>
          <textarea readOnly value={response} rows={50} cols={500}>
          </textarea>
        </div>
        <form className='flex h-[40px] gap-2' onSubmit={handleSubmit}>
          <input onChange={handleInputChange} name='input' value={message} className='chatbot-input flex-1 text-sm md:text-base outline-none bg-transparent rounded-md p-2' placeholder='Send a query ...' />
          <button type="submit" className='chatbot-send-button flex rounded-md items-center justify-center px-2.5 origin:px-3'>
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path d="M2.925 5.025L9.18333 7.70833L2.91667 6.875L2.925 5.025ZM9.175 12.2917L2.91667 14.975V13.125L9.175 12.2917ZM1.25833 2.5L1.25 8.33333L13.75 10L1.25 11.6667L1.25833 17.5L18.75 10L1.25833 2.5Z" />
            </svg>
            <span className='hidden origin:block font-semibold text-sm ml-2' onClick={handleSubmit}>Send</span>
          </button>
        </form>
      </section>
    </main>
  );
}