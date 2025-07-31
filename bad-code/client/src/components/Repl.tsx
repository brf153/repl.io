import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TerminalComponent from './ReplComponents/Terminal'
import Sidebar from './ReplComponents/Sidebar'
import CodeEditor from './ReplComponents/CodeSpace'

const Repl = () => {
  const { replId } = useParams<{ replId: string }>()
  const router = useNavigate()
  useEffect(()=>{
    // Logic to fetch and render the REPL based on replId
    if (!replId) {
      console.error('REPL ID is required');
      router('/')
      return;
    }
    console.log(`Rendering REPL with ID: ${replId}`);
    // Add your REPL rendering logic here
  }, [replId])

  return (
    <div className='w-screen h-screen flex flex-row justify-between bg-black text-white'>
      <div className='w-[10%]'><Sidebar /></div>
      <div className='bg-[#1e1e1e] w-[55%]'><CodeEditor /></div>
      <div className='w-[35%]'><TerminalComponent /></div>
    </div>
  )
}

export default Repl