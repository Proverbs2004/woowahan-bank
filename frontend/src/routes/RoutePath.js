import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from 'pages/Home';
import Register from 'pages/Register';
import Mypage from 'pages/Mypage';
import Mission from 'pages/Mission';
import KakaoLoginRedirect from 'pages/user/KakaoLoginRedirect';
import SelectFinance from 'pages/Finance/SelectFinance';
import MakeFinance from 'pages/Finance/MakeFinance';
import FinanceList from 'pages/Finance/FinanceList';

const RoutePath = () => {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mission" element={<Mission />} />
        <Route path="/selectFinance" element={<SelectFinance />} />
        <Route path="/makeFinance" element={<MakeFinance />} />
        <Route path="/financelist" element={<FinanceList />} />
        <Route
          path="/login/kakao/code"
          element={<KakaoLoginRedirect />}
        />
      </Routes>
  );
};

export default RoutePath;
        
