import react from 'react';
import { axiosInstance } from '.';

export const AddData= async(data)=>{
  return axiosInstance("post","api/data/add-data", data);
}

export const GetData= async(data)=>{
  return axiosInstance("get","api/data/get-data");
}