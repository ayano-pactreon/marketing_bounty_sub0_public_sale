'use client'

import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export default function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      easing: 'ease-out', // Easing function
      once: true, // Whether animation should happen only once
      offset: 100, // Offset from the original trigger point
      delay: 0, // Global delay for all animations
    })
  }, [])

  return null
}