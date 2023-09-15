import React, { useEffect, useState } from 'react';
import apis from "services/api/apis";

function ShowMyFamily() {
  const [familyData, setFamilyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 데이터를 가져오는 비동기 함수를 정의합니다.
    const fetchData = async () => {
      try {
        const response = await apis.get("/api/families");
        const data = response.data.data;
        setFamilyData(data); // 데이터를 상태에 저장
        setLoading(false); // 데이터 로딩이 완료됨을 표시
      } catch (error) {
        console.error('데이터를 가져오지 못했습니다:', error);
        setLoading(false); // 데이터 로딩 실패를 표시
      }
    };

    fetchData(); // 데이터 가져오기 함수 호출
  }, []); // useEffect의 두 번째 매개변수로 빈 배열을 전달하여 한 번만 실행되도록 설정

  if (loading) {
    return <div>Loading...</div>; // 데이터 로딩 중인 동안 로딩 표시
  }

  // 부모와 자식을 그룹화하기 위한 배열 선언
  const parents = [];
  const children = [];

  // 부모와 자식을 그룹화
  familyData.forEach((family) => {
    if (family.role === "ROLE_PARENT") {
      parents.push(family);
    } else if (family.role === "ROLE_CHILD") {
      children.push(family);
    }
  });

  return (
    <div>
      <h1>가족 목록</h1>
      <ul>
      <h2>부모</h2>
      <hr/>
        {parents.map((parent, index) => (
          <li key={index}>
            <p>Nickname: {parent.nickname}</p>
            <p>Role: {parent.role}</p>
            <p>Money: {parent.money}</p>
            &nbsp;
          </li>
        ))}
        {/* 부모와 자식을 구분하는 구분선 */}
        <h2>아이</h2>
        <hr/>
        {children.map((child, index) => (
          <li key={index}>
            <p>Nickname: {child.nickname}</p>
            <p>Role: {child.role}</p>
            <p>Money: {child.money}</p>
            &nbsp;
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShowMyFamily;
