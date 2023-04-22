import React from 'react'

const CountBox = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center w-[150px] rounded-xl">
      <h4 className="font-epilogue font-bold text-[30px] text-white p-3 w-full truncate rounded-xl mb-2"
      >
        {value}
        <p className="text-lg text-[#B2B250]">{title}</p>
      </h4>
    </div>
  )
}

export default CountBox