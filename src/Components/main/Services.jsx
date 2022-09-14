import React, { forwardRef } from 'react'
import Section from '../Section'
import ServicesSkill from '../ServicesSkill.jsx'
import { motion } from 'framer-motion'
import '../css/services.css'
const Services = forwardRef((props, servicesRef) => {
  return (
    <Section
      head='Services'
      sub='what i offer?'
      id='services'
      ref={servicesRef}
    >
      <div className='services-container'>
        <div className='front-services'>
          <motion.div
            className='header'
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            Front End for Websites
          </motion.div>
          <div className='s-c'>
            <ServicesSkill
              text='Responsive, Responsive website is very important for display a website in many screen devices'
              delay='1'
            />
            <ServicesSkill
              text='Animation, animated website make it easy on the eyes, and make it vital'
              delay='1.3'
            />
            <ServicesSkill
              text='PSD into Website, I can make a photoshop pictures into a website with all feauters and additions you want'
              delay='1.6'
            />
            <ServicesSkill
              text='Cheap, I offer you the cheapest price compared to other workers because I do not want money but programming'
              delay='1.9'
            />
          </div>
        </div>
      </div>
    </Section>
  )
})

export default Services
