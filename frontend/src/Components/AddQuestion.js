import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { BASE_URL } from "../port";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HF_API_KEY } from "../port";
import {pipeline} from '@xenova/transformers'
 //require('dotenv').config()
const AddQuestion = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const { currentuser } = useSelector((state) => state.userLogin);
  const token = sessionStorage.getItem("token");
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

  const [subList, setSubList] = useState([]);
  const [selectedSub, setSelectedSub] = useState([]);
  const [questiontype, setQuestionType] = useState("mcq");
  const navigate = useNavigate();
  const { state } = useLocation();
  const [questiontext,setQuestionText]=useState(null)
  const [questionEditStatus, setQuestionEditStatus] = useState(false);
  const [subType,setsubType]=useState(null)
  const [imageFile, setImageFile] = useState(null);
  const [err,setErr]=useState(null)
  const onSubmit = async (data) => {
    if (currentuser.username == "admin") {
      if (!questionEditStatus) {
        data.imageFile = imageFile;
        data.qs_id = Date.now();
        data.display_status = true;
        const res = await axios.post(`${BASE_URL}/admin-api/add-qs`, data);

        if (res.data.message === "Admin Question Created") {
          navigate(`/admin-profile/dashboard`, {
            state: { message: "Question Added" },
          });
        } else {
          console.log("try again");
        }
      } else {
        data.imageFile = imageFile;
        data.qs_id = state.qs_id;
        console.log(data);
        const res = await axios.put(`${BASE_URL}/admin-api/modify-qs`, data);

        if (res.data.message === "Question updated") {
          navigate(`/admin-profile/dashboard`, {
            state: { message: "Question Modified" },
          });
        } else {
          navigate(`/admin-profile/dashboard`, {
            state: { message: "Couldn't Modify Question" },
          });
        }
      }
    } else {
      if (!questionEditStatus) {
        data.imageFile = imageFile;
        data.userType = "Teacher";
        data.qs_id = Date.now().toString();
        data.display_status = true;
        data.username = currentuser.username;
        const res = await axios.post(`${BASE_URL}/teacher-api/add-qs`, data);
        console.log(res);
        if (res.data.message === "Teacher Question Created") {
          navigate(`../userdashboard`, {
            state: { message: "Question Created" },
          });
        } else {
          console.log("try again");
        }
      } else {
        data.imageFile = imageFile;
        data.qs_id = state.qs_id;
        data.userType = state.userType;
        data.username = state.username;
        console.log(data);
        const res = await axios.put(
          `${BASE_URL}/teacher-api/modify-qs/${currentuser.username}/Teacher`,
          data
        );
        console.log(res);
        if (res.data.message === "Question updated") {
          navigate(`../test-creation`, {
            state: { message: "Question Updated" },
          });
        } else {
          console.log("try again");
        }
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
      console.log(reader);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const stateVerify = async () => {
      console.log(state)
      //console.log(currentuser)
      if (state) {
        setImageFile(state.imageFile);
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
          question_type: state.question_type,
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
  }, [state, setValue, reset]);

  const handleSubjectChange = (e) => {
    const selectedSubject = subList.find(
      (sub) => sub.subject === e.target.value
    );
    setSelectedSub(selectedSubject ? selectedSubject.subtypes : []);
    setValue("sub_type", "");
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  /*const generateQuestion=async()=>{
    /*const questionGenerator = await pipeline("text2text-generation", "Xenova/t5-small");
    
    const prompt = `generate a question: ${selectedSub} topic ${subType}`;
    const output = await questionGenerator(prompt, { max_length: 100, num_return_sequences: 1 });

    console.log("Generated Question:", output[0].generated_text);*//*
  }*/


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
            onChange={(e)=>setsubType(e.target.value)}
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
            value={questiontext}
            className="form-control"
            {...register("question", { required: true })}
          />
          {err && <p className="text-danger">{err}</p>}          
          {errors.question && (
            <div className="text-danger">Question is required.</div>
          )}
        </div>
       

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="text" className="form-control" {...register("img")} />
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
          <label className="form-label">Question Type</label>
          <select
            className="form-select"
            defaultValue={"mcq"}
            {...register("question_type", { required: true })}
            onChange={(event) => setQuestionType(event.target.value)}
          >
            <option value="">Select...</option>
            <option value="mcq">MCQ</option>
            <option value="fib">Fill in the blanks</option>
            <option value="num">Numerical</option>
            <option value="descp">Descriptive</option>
          </select>
          {errors.question_type && (
            <div className="text-danger">Question Type is required.</div>
          )}
        </div>

        {questiontype=="mcq" && <div>
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
        </div>}
        
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
          {questiontype == "mcq" && (
            <select
              className="form-select"
              {...register("validity_answer", { required: true })}
            >
              <option value="">Select...</option>
              <option value="mcq_op1">Option 1</option>
              <option value="mcq_op2">Option 2</option>
              <option value="mcq_op3">Option 3</option>
              <option value="mcq_op4">Option 4</option>
            </select>
          )}

          {questiontype == "fib" && (
            <input
              type="text"
              className="form-control"
              {...register("validity_answer", { required: true })}
            />
          )}

          {questiontype === "num" && (
            <div className="mb-3">
              <label className="form-label">(Numerical Answer)</label>
              <input
                type="number" // Use type="number" for numerical input
                step="any" // Allows both integers and decimals
                className="form-control"
                {...register("validity_answer", {
                  required: "Numerical Answer is required",
                  validate: (value) => {
                    if (isNaN(value)) {
                      return "Please enter a valid number";
                    }
                    return true;
                  },
                })}
              />
            </div>
          )}

          {questiontype === "descp" && (
            <div className="mb-3">
              <label className="form-label">(Descriptive Answer)</label>
              <textarea // Use textarea for descriptive answers
                className="form-control"
                rows={6} // Set the number of rows for the textarea
                {...register("validity_answer", {
                  required: "Descriptive Answer is required",
                  minLength: {
                    value: 10,
                    message:
                      "Descriptive Answer must be at least 10 characters long",
                  },
                })}
              />
            </div>
          )}

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
            defaultValue={state.subject}
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
            defaultValue={state.sub_type}
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
            defaultValue={state.question}
          />
          {errors.question && (
            <div className="text-danger">Question is required.</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input type="text" className="form-control" {...register("img")} defaultValue={state.img} />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            defaultValue={state.file}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Question Type</label>
          <select
            className="form-select"
            defaultValue={state.question_type}
            {...register("question_type", { required: true })}
            onChange={(event) => setQuestionType(event.target.value)}
            
          >
            <option value="">Select...</option>
            <option value="mcq">MCQ</option>
            <option value="fib">Fill in the blanks</option>
            <option value="num">Numerical</option>
            <option value="descp">Descriptive</option>
          </select>
          {errors.question_type && (
            <div className="text-danger">Question Type is required.</div>
          )}
        </div>

        {questiontype=="mcq" && <div>
          <div className="mb-3">
            <label className="form-label">Option 1</label>
            <input
              type="text"
              className="form-control"
              {...register("option_1", { required: true })}
              defaultValue={state.option_1}
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
              defaultValue={state.option_2}
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
              defaultValue={state.option_3}
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
              defaultValue={state.option_4}
            />
            {errors.option_4 && (
              <div className="text-danger">Option 4 is required.</div>
            )}
          </div>
        </div>}
        
        <div className="mb-3">
          <label className="form-label">Difficulty</label>
          <select
            className="form-select"
            {...register("difficulty", { required: true })}
            defaultValue={state.difficulty}
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
          {questiontype == "mcq" && (
            <select
              className="form-select"
              {...register("validity_answer", { required: true })}
              defaultValue={state.validity_answer}
            >
              <option value="">Select...</option>
              <option value="mcq_op1">Option 1</option>
              <option value="mcq_op2">Option 2</option>
              <option value="mcq_op3">Option 3</option>
              <option value="mcq_op4">Option 4</option>
            </select>
          )}

          {questiontype == "fib" && (
            <input
              type="text"
              className="form-control"
              {...register("validity_answer", { required: true })}
              defaultValue={state.validity_answer}
            />
          )}

          {questiontype === "num" && (
            <div className="mb-3">
              <label className="form-label">(Numerical Answer)</label>
              <input
                type="number" // Use type="number" for numerical input
                step="any" // Allows both integers and decimals
                className="form-control"
                {...register("validity_answer", {
                  required: "Numerical Answer is required",
                  validate: (value) => {
                    if (isNaN(value)) {
                      return "Please enter a valid number";
                    }
                    return true;
                  },
                })}
                defaultValue={state.validity_answer}
              />
            </div>
          )}

          {questiontype === "descp" && (
            <div className="mb-3">
              <label className="form-label">(Descriptive Answer)</label>
              <textarea // Use textarea for descriptive answers
                className="form-control"
                rows={6} // Set the number of rows for the textarea
                {...register("validity_answer", {
                  required: "Descriptive Answer is required",
                  minLength: {
                    value: 10,
                    message:
                      "Descriptive Answer must be at least 10 characters long",
                  },
                })}
                defaultValue={state.validity_answer}
              />
            </div>
          )}

          {errors.validity_answer && (
            <div className="text-danger">Validity Answer is required.</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
