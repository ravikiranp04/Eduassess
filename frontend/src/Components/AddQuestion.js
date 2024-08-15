import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASE_URL } from "../port";
import { useLocation, useNavigate } from "react-router-dom";

const AddQuestion = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Use reset to update form values programmatically
    setValue, // Use setValue to set default values dynamically
  } = useForm();
  
  const [subList, setSubList] = useState([]);
  const [selectedSub, setSelectedSub] = useState([]);
 
  const navigate = useNavigate();
  const { state } = useLocation();
  const [questionEditStatus, setQuestionEditStatus] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  
  const onSubmit = async (data) => {
    if (!questionEditStatus) {
      data.imageFile=imageFile
      data.qs_id = Date.now();
      data.display_status = true;
      const res = await axios.post(`${BASE_URL}/admin-api/add-qs`, data);
    
      if (res.data.message === "Admin Question Created") {
        navigate(`/admin-profile/dashboard`,{state:{message:"Question Added"}});
      } else {
        console.log("try again");
      }
    } else {
      data.imageFile=imageFile
      data.qs_id=state.qs_id
      console.log(data);
      const res = await axios.put(`${BASE_URL}/admin-api/modify-qs`,data);
     
      if(res.data.message==='Question updated'){
        navigate(`/admin-profile/dashboard`,{state:{message:"Question Modified"}})
      }
      else{
        navigate(`/admin-profile/dashboard`,{state:{message:"Couldn't Modify Question"}})
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      console.log(reader)
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const stateVerify = async () => {
      if (state) {
        setImageFile(state.imageFile)
        setQuestionEditStatus(true);
        // Pre-select the subject and subtypes
        reset({
          subject: state.subject,
          sub_type: state.sub_type,
          question: state.question,
          img: state.img,
          option_1: state.option_1,
          option_2: state.option_2,
          option_3: state.option_3,
          option_4: state.option_4,
          difficulty: state.difficulty,
          validity_answer: state.validity_answer,
        });
        setSelectedSub(state.subtypes || []);
        
      } else {
        setQuestionEditStatus(false);
      }
    };

    const getSubList = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/admin-api/get-subjects`);
        if (res.data.message === "Subjects are") {
          setSubList(res.data.payload);
        } else {
          console.log(res.data.message);
        }
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    getSubList();
    stateVerify();
  }, [state, setValue, reset]); // Include dependencies to re-run effects as needed

  const handleSubjectChange = (e) => {
    const selectedSubject = subList.find(
      (sub) => sub.subject === e.target.value
    );
    setSelectedSub(selectedSubject ? selectedSubject.subtypes : []);
    setValue("sub_type", ""); // Clear sub_type value when subject changes
  };

  const handleRemoveImage = ()=>{
    setImageFile(null);
  }

  return questionEditStatus === false ? (
    <div className="container mt-5">
      <h2 className="mb-4">Add a New Question</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="needs-validation"
        noValidate
      >
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <select
            className="form-select"
            {...register("subject", { required: true })}
            onChange={handleSubjectChange}
          >
            <option value="">Select...</option>
            {subList.map((sub, index) => (
              <option key={index} value={sub.subject}>
                {sub.subject}
              </option>
            ))}
          </select>
          {errors.subject && (
            <div className="text-danger">Subject is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Sub Type</label>
          <select
            className="form-select"
            {...register("sub_type", { required: true })}
          >
            <option value="">Select...</option>
            {selectedSub.map((subtp, index) => (
              <option key={index} value={subtp}>
                {subtp}
              </option>
            ))}
          </select>
          {errors.sub_type && (
            <div className="text-danger">Sub Type is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Question</label>
          <input
            type="text"
            className="form-control"
            {...register("question", { required: true })}
          />
          {errors.question && (
            <div className="text-danger">Question is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            {...register("img")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Option 1</label>
          <input
            type="text"
            className="form-control"
            {...register("option_1", { required: true })}
          />
          {errors.option_1 && (
            <div className="text-danger">Option 1 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Option 2</label>
          <input
            type="text"
            className="form-control"
            {...register("option_2", { required: true })}
          />
          {errors.option_2 && (
            <div className="text-danger">Option 2 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Option 3</label>
          <input
            type="text"
            className="form-control"
            {...register("option_3", { required: true })}
          />
          {errors.option_3 && (
            <div className="text-danger">Option 3 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Option 4</label>
          <input
            type="text"
            className="form-control"
            {...register("option_4", { required: true })}
          />
          {errors.option_4 && (
            <div className="text-danger">Option 4 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            {...register("difficulty", { required: true })}
          >
            <option value="">Select...</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && (
            <div className="text-danger">Difficulty is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Validity Answer</label>
          <select
            className="form-select"
            {...register("validity_answer", { required: true })}
          >
            <option value="">Select...</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
            <option value="4">Option 4</option>
          </select>
          {errors.validity_answer && (
            <div className="text-danger">Validity Answer is required.</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  ) : (
    <div className="container mt-5">
      <h2 className="mb-4">Modify Question</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="needs-validation"
        noValidate
      >
        <div className="mb-3">
          <label className="form-label">Subject</label>
          <select
            className="form-select"
            {...register("subject", { required: true })}
            onChange={handleSubjectChange}
            defaultValue={state.subject} // Set default value for edit mode
          >
            <option value="">Select...</option>
            {subList.map((sub, index) => (
              <option key={index} value={sub.subject}>
                {sub.subject}
              </option>
            ))}
          </select>
          {errors.subject && (
            <div className="text-danger">Subject is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Sub Type</label>
          <select
            className="form-select"
            {...register("sub_type", { required: true })}
            defaultValue={state.sub_type} // Set default value for edit mode
          >
            <option value="">Select...</option>
            {selectedSub.map((subtp, index) => (
              <option key={index} value={subtp}>
                {subtp}
              </option>
            ))}
          </select>
          {errors.sub_type && (
            <div className="text-danger">Sub Type is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Question</label>
          <input
            type="text"
            className="form-control"
            {...register("question", { required: true })}
          />
          {errors.question && (
            <div className="text-danger">Question is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            {...register("img")}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image (Jpeg Only)</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>
        {
          imageFile && <div className="d-flex">
            <img src={imageFile} alt='Upload an Image' style={{height:'400px',width:'250px'}}/>
            <button className="btn btn-danger m-2" style={{height:'50px'}} onClick={handleRemoveImage}>Remove Image</button>
          </div>
          
        }

        <div className="mb-3">
          <label className="form-label">Option 1</label>
          <input
            type="text"
            className="form-control"
            {...register("option_1", { required: true })}
          />
          {errors.option_1 && (
            <div className="text-danger">Option 1 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Option 2</label>
          <input
            type="text"
            className="form-control"
            {...register("option_2", { required: true })}
          />
          {errors.option_2 && (
            <div className="text-danger">Option 2 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Option 3</label>
          <input
            type="text"
            className="form-control"
            {...register("option_3", { required: true })}
          />
          {errors.option_3 && (
            <div className="text-danger">Option 3 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Option 4</label>
          <input
            type="text"
            className="form-control"
            {...register("option_4", { required: true })}
          />
          {errors.option_4 && (
            <div className="text-danger">Option 4 is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            {...register("difficulty", { required: true })}
          >
            <option value="">Select...</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && (
            <div className="text-danger">Difficulty is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Validity Answer</label>
          <select
            className="form-select"
            {...register("validity_answer", { required: true })}
          >
            <option value="">Select...</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
            <option value="4">Option 4</option>
          </select>
          {errors.validity_answer && (
            <div className="text-danger">Validity Answer is required.</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
