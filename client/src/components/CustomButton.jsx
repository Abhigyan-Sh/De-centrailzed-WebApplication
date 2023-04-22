import React from 'react'

const CustomButton = ({ btnType, title, handleClick, styles }) => {
  return (
    <button
      type={btnType}
      className={`font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[52px] px-4 rounded-[10px] border-b-4 border-[#5338b5] ${styles} hover:-translate-y-1 duration-300`}
      onClick={handleClick}
    >
      {title}
    </button>
  )
}

export default CustomButton