import FileInput from "~/components/FileInput";
import { useState } from "react";
import { useEdgeStore } from "~/lib/edgestore";

const imageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/tiff", "mage/bmp", "image/x-icon"]
const videoTypes = ["video/mp4", "video/webm", "video/mov"]



export default function Home() {

  const [file, setFile] = useState<File | undefined>(undefined)
  const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)
  const [fileType, setFileType] = useState<string | undefined>(undefined)
  const { edgestore } = useEdgeStore();

  function handleChange(e:React.ChangeEvent<HTMLInputElement>) {
    const tempFile = e.target.files?.[0]  
        setFile(tempFile)
        console.log(tempFile, tempFile?.type)
        if ( tempFile === undefined || tempFile.type === undefined) {
            setFileType(undefined)
        } else if (imageTypes.includes(tempFile?.type)) { 
            setFileType("image")
        } else if (videoTypes.includes(tempFile?.type)) { 
            setFileType("video")
        } 
        


        if (fileUrl) {
            URL.revokeObjectURL(fileUrl)
        }

        if (tempFile) {
            const url = URL.createObjectURL(tempFile)
            setFileUrl(url)
        } else {
            setFileUrl(undefined)
            setFileType(undefined)
        }
  }



  async function handleSubmit(e:React.FormEvent) {
    e.preventDefault()
    if (file != undefined) {
        const res = await edgestore.publicFiles.upload({
            file,
            options: {
                replaceTargetUrl: fileUrl,
            },
            });
        const EdgeStoreFileUrl = res.url
    if (EdgeStoreFileUrl === undefined) {
      // Here: store EdgeStroeFileUrl to db
    setFile(undefined)
    setFileType(undefined)
    }
    
  }}


  return (
    <div>
      <h1>Home</h1>
      <form className="flex flex-row w-96" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <FileInput onChange={handleChange}/>
          <div className="w-4/5 h-4/5">
          {fileType === "image" && <img className="w-3/4 h-3/4" src={fileUrl} alt="" />}
          {fileType === "video" && <video className="w-3/4 h-3/4" src={fileUrl}></video>}
          </div>
        </div>
        <button type="submit" className="border-gray-500 border-2 h-min">Submit</button>
      </form>


      
    </div>
  )

}