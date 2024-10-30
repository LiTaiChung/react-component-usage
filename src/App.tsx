import { RouterProvider } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <RouterProvider router={router} fallbackElement={<p>Initial Load...</p>} />
  )
}

export default App
