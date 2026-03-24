import React from 'react'
import Button from './Button'

const Main = () => {
  return (
    <>
    <div className='container'>
        <div className='p-s text-center bg-light-dark rounded'>
            <h1 className='text-light'>Stock prediction Potal</h1>
            <p className='text-light lead'>
                Include every Bootstrap JavaScript plugin and dependency with one of our 
                two bundles. Both bootstrap.bundle.js and bootstrap.bundle.min.js include
                Popper for our tooltips and popovers. For more information about what’s 
                included in Bootstrap, please see our contents section.
            </p>
            <Button text='login' class='btn-outline-info'/>
        </div>
    </div>
    </>
  )
}

export default Main