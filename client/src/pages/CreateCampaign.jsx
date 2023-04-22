import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: '',
    title: '',
    description: '',
    target: '', 
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if(exists) {
        setIsLoading(true)
        await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18)})
        setIsLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setForm({ ...form, image: '' });
      }
    })
  }

  return (
    <div className="justify-center items-center flex-col rounded-[10px] sm:p-10 p-4 w-[70%]">
      {isLoading && <Loader />}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start your Campaign 🙀</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="your name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
          <FormField 
            labelName="campaign title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>

        <FormField 
            labelName="describe up what's your Story ! *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />

        <div className="w-full flex justify-start items-center p-4 bg-[#B2B250] h-[120px] rounded-[10px]">
          <img src={money} alt="money" className="w-[20px] h-[20px] object-contain"/>
          <img src={money} alt="money" className="w-[30px] h-[30px] object-contain"/>
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <img src={money} alt="money" className="w-[30px] h-[30px] object-contain"/>
          <img src={money} alt="money" className="w-[20px] h-[20px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">
            You will receive <span className="text-3xl">97%</span> of the amount raised
          </h4>
        </div>

        <div className="flex flex-wrap gap-[40px]">
          <FormField 
            labelName="target *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
          <FormField 
            labelName="end date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <FormField 
            labelName="campaign image (place url of your campaign image)*"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange('image', e)}
          />

          <div className="flex justify-center items-center mt-[40px] gap-12">
            <CustomButton 
              btnType="submit"
              title="Back to campaigns"
              styles="border-2 hover:bg-[#8c6dfd]"
            />
            <CustomButton 
              btnType="submit"
              title="Submit new campaign"
              styles="bg-[#8c6dfd]"
            />
          </div>
      </form>
    </div>
  )
}

export default CreateCampaign