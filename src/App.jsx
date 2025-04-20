import React from 'react'
import Sidebar from './Sidebar'
import Feed from './Feed'
import Suggested from './Suggested'
import Footer from './Footer'
import './App.css'
import TopBar from './TopBar'

function App() {
  return (
    <div className="d-flex ck flex-column min-vh-100">
      <TopBar />
      <div className="container mt-5 flex-grow-1">
        <div className="row">
          <div className="d-none d-md-block col-md-2">
            <Sidebar />
          </div>
          <div className="col-12 col-md-7">
            <Feed />
          </div>
          <div className="d-none d-md-block col-md-3">
            <Suggested />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default App
