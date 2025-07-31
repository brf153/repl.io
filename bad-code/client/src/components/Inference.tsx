import React from 'react'
import { useNavigate } from 'react-router-dom'

const Inference = () => {
  const [replId, setReplId] = React.useState<string>('')
  const [tech, setTech] = React.useState<string>('react')
  const router = useNavigate()
  const renderRepl = () => {
    // Logic to render the REPL based on inference ID
    const inferenceId = replId.trim();
    if (!inferenceId) {
      console.error('Inference ID is required');
      return;
    }
    router(`/code/${inferenceId}`);
  }
  return (
    <div className='w-screen items-center flex flex-col gap-10 h-screen'>
      <h1 className='text-2xl font-bold mt-20'>Inference</h1>
      <div className='border p-5 rounded-lg shadow-md w-1/2 flex flex-col gap-5'>
        <p className='text-xl'>Please enter the details for inference:</p>
        <div className='flex flex-col gap-2'>
          <label htmlFor="inference-id">Inference ID:</label>
          <input onChange={(e) => setReplId(e.target.value)} className='border p-2 rounded-md' id="inference-id" type="text" placeholder="Enter Inference ID" />
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor="tech">Technology:</label>
          <select value={tech} onChange={(e) => setTech(e.target.value)} className='border p-2 rounded-md' id="tech">
            <option value="react">React</option>
            <option value="flask">Flask</option>
          </select>
        </div>
        <button onClick={renderRepl} className='bg-blue-500 text-white p-2 rounded-md cursor-pointer'>Submit</button>
      </div>
    </div>
  )
}

export default Inference