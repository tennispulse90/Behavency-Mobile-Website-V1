import React from 'react'
import Hero from './sections/Hero'
import WhyNow from './sections/WhyNow'
import Platform from './sections/Platform'
import Identify from './sections/Identify'
import Model from './sections/Model'
import Engage from './sections/Engage'
import Play from './sections/Play'
import Journey from './sections/Journey'
import Build from './sections/Build'
import Measure from './sections/Measure'
import HowMeasure from './sections/HowMeasure'
import Different from './sections/Different'

import './typography.css'

export default function App() {
  return (
    <>
      <div className="nav-space" aria-hidden="true" />
      <main id="top">
        <Hero />
        <WhyNow />
        <Platform />
        <Identify />
        <Model single />
        <Engage />
        <Play />
        <Build />
        <Journey />
        <Measure />
        <HowMeasure />
        <Different />
      </main>
    </>
  )
}
