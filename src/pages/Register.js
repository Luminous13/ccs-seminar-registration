import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, Button } from "antd";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as Add2Calendar from "add2calendar";
import { STUDENTS } from "../config/firebase";
import BackgroundImage from "../assets/images/background.jpg";
import "add2calendar/css/add2calendar.css";

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background: url(${BackgroundImage}) no-repeat center center fixed;
  background-size: cover;
  overflow: hidden;
`;

export const CenterContainer = styled.div`
  border-radius: 12px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: ${(props) => (props.isDone ? "25px" : "25px 50px 50px 50px")};
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 450px;
`;

export const HeaderText = styled.span`
  font-weight: bold;
  font-size: 24px;
`;

export const StyledInput = styled(Input)`
  padding: 10px;
  border-radius: 5px;
  border: none;
`;

export const StyledButton = styled(Button)`
  border-radius: 5px;
  box-shadow: -10px 10px 16px 0px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: -10px 10px 16px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: -10px 10px 16px 0px rgba(0, 0, 0, 0.6);
`;

export const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
  box-shadow: -10px 10px 16px 0px rgba(0, 0, 0, 0.6);
  -webkit-box-shadow: -10px 10px 16px 0px rgba(0, 0, 0, 0.6);
  -moz-box-shadow: -10px 10px 16px 0px rgba(0, 0, 0, 0.6);
`;

export const ErrorMessage = styled.span`
  color: red;
  align-self: flex-start;
`;

const schema = yup.object().shape({
  studentId: yup.string().required("Required"),
  lastName: yup.string().required("Required"),
  firstName: yup.string().required("Required"),
  email: yup
    .string()
    .matches(
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      "Invalid Email"
    )
    .required("Required"),
});

const fields = [
  {
    name: "studentId",
    placeholder: "Student ID",
  },
  {
    name: "lastName",
    placeholder: "Last Name",
  },
  {
    name: "firstName",
    placeholder: "First Name",
  },
  {
    name: "email",
    placeholder: "Email",
  },
];

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (isDone) {
      const singleEvent = new Add2Calendar({
        title: "CCS Seminar",
        start: "July 22, 2021 16:00",
        end: "July 22, 2021 18:00",
        location: "meet.google.com/ejk-nqtp-hkr",
        description: "App Creation and Deployment made Easy",
      });
      singleEvent.createWidget("#single-normal");
    }
  }, [isDone]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    data.dateRegistered = new Date();
    data.isPresent = false;
    data.dateAttended = new Date();
    console.log(data);

    const doc = await STUDENTS.where("studentId", "==", data.studentId).get();

    if (doc.empty) {
      STUDENTS.doc(data.studentId)
        .set(data)
        .then(() => {
          setIsDone(true);
        })
        .catch(() => {
          alert("Something went wrong, please try again later.");
        });
    } else {
      alert("Already Registered");
    }

    setIsLoading(false);
  };

  return (
    <MainContainer>
      {!isDone ? (
        <CenterContainer>
          <div
            style={{
              marginBottom: 30,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <HeaderText>CCS Seminar</HeaderText>
            <HeaderText>Registration</HeaderText>
          </div>

          {fields.map((obj) => (
            <div style={{ width: "100%" }} key={obj.name}>
              {errors[obj.name] && (
                <ErrorMessage>{errors[obj.name]?.message}</ErrorMessage>
              )}
              <InputContainer>
                <StyledInput
                  {...register(obj.name)}
                  placeholder={obj.placeholder}
                />
              </InputContainer>
            </div>
          ))}

          <StyledButton
            type="primary"
            block
            onClick={handleSubmit(onSubmit)}
            loading={isLoading}
          >
            Submit
          </StyledButton>
        </CenterContainer>
      ) : (
        <CenterContainer isDone>
          <HeaderText>Registered Successfully!</HeaderText>
          <HeaderText>See you on July 22, 2021</HeaderText>
          <div id="single-normal" />
        </CenterContainer>
      )}
    </MainContainer>
  );
};

export default App;
