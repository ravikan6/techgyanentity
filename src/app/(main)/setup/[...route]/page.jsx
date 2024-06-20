import React from 'react'

const page = ({ params }) => {
  const path = params.route.join('/');

  return (
    <div>
      THis is steup/...route/page/
      {path}
    </div>
  )
}

export default page
