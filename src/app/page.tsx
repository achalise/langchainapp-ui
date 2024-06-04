"use client"
import { useRef, useState } from "react"

export default function Chat() {
  const ref = useRef();
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [file, setFile] = useState<File | null>(null)
  const [fileUploadMsg, setFileUploadMsg] = useState<string>("");
  const [fileSelected, setFileSelected] = useState<string>("");

  const upload = () => {
    const url = 'http://localhost:8080/upload';
    const formData = new FormData();
    formData.append("file", file as Blob);

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
        setFileSelected("N");
        setTimeout(() => {
          setFileUploadMsg("");
        }, 4000)
        ref.current.value = "";
      })
      .catch(error => {
        // Handle any error that occurs during the request
        console.error(error);
        setFileUploadMsg("Error");
        setFileSelected("N");
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
    setFileSelected("Y");
  }

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <section className='chatbot-section flex flex-col origin:w-[800px] w-full origin:h-[735px] h-full rounded-md p-2 md:p-6'>
      <div className='chatbot-header pb-6'>
          <div className='flex justify-between'>
            A simple RAG application using LangChain4J in the backend
          </div>
        </div>
        <label className="w-3/4">Upload file for RAG query:</label>
        <div className="flex items-left justify-start">

          <div className="w-1/2 flex flex-col">
            <label className="block">
              <span className="sr-only">Choose file</span>
              <input type="file" ref={ref} onChange={selectFile} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-black-700 hover:file:bg-violet-100"></input>
            </label>
          </div>
          {(fileSelected === "Y") && <button onClick={upload} className="bg-violet-50 hover:bg-violet-100 text-sm text-black-700 font-bold py-2 px-4 rounded-full">
            Upload
          </button>}
          {
            <div className='flex justify-between'>
            {fileUploadMsg}
          </div>
          }

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