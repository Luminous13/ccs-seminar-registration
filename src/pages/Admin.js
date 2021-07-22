import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import { Table, Button } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { STUDENTS } from "../config/firebase";
import CsvDownloader from "react-csv-downloader";

export const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  padding: 25px;
`;

export const HeaderContainer = styled.div`
  margin-bottom: 50px;
  width: 100%;
  text-align: center;
`;

export const HeaderText = styled.span`
  font-size: 24px;
  font-weight: bold;
`;

export const LoadingScreen = styled.div`
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Admin = () => {
  const [listStudents, setListStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => fetchStudentList(), []);

  const columns = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Date Registered",
      dataIndex: "dateRegistered",
      key: "dateRegistered",
      render: (data) => moment(data.toDate() || data).format("LLL"),
    },
    {
      title: "Status",
      dataIndex: "isPresent",
      key: "isPresent",
      render: (text, record) => {
        if (text) {
          return <span>Present</span>;
        } else {
          return (
            <Button
              type="primary"
              onClick={() => handleAttendance(record.studentId)}
            >
              Here
            </Button>
          );
        }
      },
    },
  ];

  const handleAttendance = (studentId) => {
    setIsLoading(true);
    const index = listStudents.findIndex((obj) => obj.studentId === studentId);
    const _tmpList = listStudents.slice();

    _tmpList[index].isPresent = true;

    STUDENTS.doc(studentId)
      .update({
        isPresent: true,
      })
      .then(() => setListStudents(_tmpList))
      .catch((err) => alert(err));

    setIsLoading(false);
  };

  const fetchStudentList = () => {
    STUDENTS.get().then((snapshot) => {
      setListStudents(snapshot.docs.map((doc) => doc.data()));
    });
  };

  return (
    <MainContainer>
      {isLoading && (
        <LoadingScreen>
          <LoadingOutlined
            style={{ color: "white", fontWeight: "bold", fontSize: 36 }}
          />
        </LoadingScreen>
      )}
      <HeaderContainer>
        <HeaderText>Attendance</HeaderText>
      </HeaderContainer>
      <CsvDownloader
        filename={`seminar-attendance-${moment().format()}`}
        extension=".csv"
        separator=";"
        wrapColumnChar="'"
        // columns={columns}
        datas={listStudents}
        text="DOWNLOAD"
      >
        <button>Download</button>
      </CsvDownloader>
      <Table dataSource={listStudents} columns={columns} />
    </MainContainer>
  );
};

export default Admin;
