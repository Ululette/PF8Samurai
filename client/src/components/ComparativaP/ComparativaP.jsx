import React, { useState, useEffect } from 'react';
import InfoPlanCard from './InfoPlanCard';
import './ComparativaP.css';
import family from '../../assets/images/family.png';
import fondo from '../../assets/images/fondo1.png';
import supabase from "../../supabase.config";
import ListItemLink from './ListItemLink';
import AcccessibleTable from './AcccessibleTable';
//path='/ComparativaP'

export default function ComparativaP() {

  let [plans, setPlans] = useState([]);

  async function getPlans() {
    const { data: plans, error } = await supabase
      .from("plans")
      .select("id, name, price, benefits (id,title)");
    setPlans(plans);
  }

  useEffect(() => {
    getPlans()
  }, [])

  useEffect(() => {
    // if (plans.length) {
    //   console.log(plans)
    // }
  }, [plans])

  return (
    <div className='comp_page'>
      <div className='comp_header'>
        <h1 className=' comp_header_title'> Tenemos un plan para vos </h1>
        <img className='comp_header_image' src={family} width="100" height="100" alt="" />
      </div>
      <div className='container_img'>
        <img src={fondo} className='fondotop' />
      </div>
      <div className='back-definer'>
        <div className='comp_cont'>
          {plans.length && <InfoPlanCard
            name={plans[0].name}
            price={plans[0].price}
            benefits={plans[0].benefits.map(benefobj => benefobj.title)}
          />}
        </div>
        <AcccessibleTable plans={plans} />
      </div>
    </div>
  )
}
