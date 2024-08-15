import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { BASE_URL } from '../port';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
function AddSubject() {
  const { register, control, handleSubmit,reset } = useForm();
  const [subjectEditStatus, setSubjectEditStatus]=useState(false);
    const navigate=useNavigate()
    const {state}=useLocation()

    const [err,setErr]=useState('');
  const { fields, append, remove ,replace} = useFieldArray({
    control,
    name: 'subtypes'
  });

  useEffect(()=>{
    const stateVerify = async()=>{
      if(state){
        console.log(state)
        setSubjectEditStatus(true);
        replace(state.subtypes)
      }
      else{
        setSubjectEditStatus(false)
      }
    }
    stateVerify();
    },[])

  const onSubmit = async(data) => {
    console.log(data);
    if(subjectEditStatus===false){
      data.subjectid= Date.now();
      const res = await axios.post(`${BASE_URL}/admin-api/add-subject`,data);
      console.log(res);
      if(res.data.message==='Subject added Successfully'){
        navigate('../dashboard')
      }
      else{
        setErr(res.data.message);
        console.log(err);
      }
    }
    else{
      data.subjectid=state.subjectid
      data.subject=state.subject
      delete data._id
      console.log(data)
      const res = await axios.put(`${BASE_URL}/admin-api/modify-subject`,data);
      console.log(res)
      setSubjectEditStatus(false)
      if(res.data.message=='Subject Modified'){
        console.log('Subject Modified')
        navigate(`/admin-profile/admin-subject`,{state: {message:"Subject Modified Successfully"}})
      }
      else{
        console.log('Try Again')
        navigate(`/admin-profile/admin-subject`,{state: {message:"Error Modifying the subject!!"}})
      }
    }
    
  };

  /*const saveSubject=async(obj)=>{
    const finalobj = {...state,obj}
    console.log(obj)
    delete finalobj._id
    console.log(finalobj)
    const res = await axios.put(`${BASE_URL}/admin-api/modify-subject`,finalobj);
    console.log(res)
    if(res.data.message=='Subject Modified'){
      console.log('Subject Modified')
      navigate(`/admin-profile/admin-subject`,{state: {message:"Subject Modified Successfully"}})
    }
    else{
      console.log('Try Again')
      navigate(`/admin-profile/admin-subject`,{state: {message:"Error Modifying the subject!!"}})
    }
  }*/

  return (
    
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', minHeight: '90vh', background: '#f0f0f0', overflowY: fields.length > 1 ? 'auto' : 'hidden' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '600px', padding: '20px', backgroundColor: '#ffffff', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
        
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="subject" style={{ fontSize: '16px', marginBottom: '5px', display: 'block' }}>Subject:</label>
          {
            subjectEditStatus===false?<input id="subject" {...register('subject')} style={{ marginLeft: '10px', padding: '10px', width: '100%', boxSizing: 'border-box', fontSize: '14px', border: '1px solid #ccc', borderRadius: '3px' }} />:
            <input id="subject" defaultValue={state.subject} {...register('subject')} style={{ marginLeft: '10px', padding: '10px', width: '100%', boxSizing: 'border-box', fontSize: '14px', border: '1px solid #ccc', borderRadius: '3px' }}/>
          }
          
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ fontSize: '16px', marginBottom: '5px', display: 'block' }}>Subtypes:</label>
          {fields.map((field, index) => (
            <div key={field.id} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
              <input
                {...register(`subtypes.${index}`)}
                defaultValue={field}
                style={{ marginRight: '10px', padding: '8px', flex: '1', boxSizing: 'border-box', fontSize: '14px', border: '1px solid #ccc', borderRadius: '3px' }}
              />
              <FaMinus style={{ cursor: 'pointer', fontSize: '18px', color: '#f44336' }} onClick={() => remove(index)} />
            </div>
          ))}
          <button
            type="button"
            onClick={() => append('')}
            style={{ padding: '8px 12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginBottom: '10px' }}
          >
            <FaPlus style={{ marginRight: '5px' }} /> Add Subtype
          </button>
        </div>
        {
          subjectEditStatus===false?<button type="submit" style={{ padding: '12px 24px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', float: 'right' }}>Submit</button>:
          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', float: 'right' }}>Save Changes</button>
        }
        
      </form>
    </div>
    
  );
}

export default AddSubject;
