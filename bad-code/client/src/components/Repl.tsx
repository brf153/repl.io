import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TerminalComponent from './Terminal'

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
    <div>
      <div>Repl ID: {replId}</div>
      <div><TerminalComponent /></div>
    </div>
  )
}

export default Repl