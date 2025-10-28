import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Play, Square, Trash2, Sparkles, Save, Upload, Sliders, Music, Scissors, Merge, SplitSquareHorizontal, Volume2, Mic, Video, FileAudio, Repeat, AudioLines, Settings2, AudioWaveform, Shuffle, Disc3 } from 'lucide-react'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [swing, setSwing] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState(16)
  const [selectedKit, setSelectedKit] = useState('techno')
  const [showMixer, setShowMixer] = useState(false)
  const [showRemixLive, setShowRemixLive] = useState(false)
  const [selectedTrackForEdit, setSelectedTrackForEdit] = useState(null)
  
  // 8 tracks with customizable instruments and mixer settings
  const [tracks, setTracks] = useState([
    { name: 'Kick', instrument: 'kick-808', pattern: Array(64).fill(false), volume: 0.8, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null },
    { name: 'Snare', instrument: 'snare-acoustic', pattern: Array(64).fill(false), volume: 0.7, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null },
    { name: 'Hi-Hat', instrument: 'hihat-closed', pattern: Array(64).fill(false), volume: 0.6, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null },
    { name: 'Perc', instrument: 'perc-shaker', pattern: Array(64).fill(false), volume: 0.5, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null },
    { name: 'Vocal', instrument: 'vocal-chop-male', pattern: Array(64).fill(false), volume: 0.6, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null },
    { name: 'Synth', instrument: 'synth-bass', pattern: Array(64).fill(false), volume: 0.7, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null },
    { name: 'Lead', instrument: 'synth-lead-square', pattern: Array(64).fill(false), volume: 0.6, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null },
    { name: 'Bass', instrument: 'bass-sub', pattern: Array(64).fill(false), volume: 0.8, pan: 0, effect: 'none', effectAmount: 50, eqLow: 0, eqMid: 0, eqHigh: 0, customSample: null }
  ])

  const audioContextRef = useRef(null)
  const schedulerRef = useRef(null)
  const nextNoteTimeRef = useRef(0)
  const currentNoteRef = useRef(0)
  const customSamplesRef = useRef({})

  // Comprehensive categorized instruments
  const instrumentOptions = {
    kicks: [
      { id: 'kick-808', name: '808 Kick', category: 'Kicks' },
      { id: 'kick-acoustic', name: 'Acoustic Kick', category: 'Kicks' },
      { id: 'kick-sub', name: 'Sub Kick', category: 'Kicks' },
      { id: 'kick-trap', name: 'Trap Kick', category: 'Kicks' },
      { id: 'kick-house', name: 'House Kick', category: 'Kicks' },
      { id: 'kick-techno', name: 'Techno Kick', category: 'Kicks' },
      { id: 'kick-distorted', name: 'Distorted Kick', category: 'Kicks' },
      { id: 'kick-punchy', name: 'Punchy Kick', category: 'Kicks' },
      { id: 'kick-deep', name: 'Deep Kick', category: 'Kicks' },
      { id: 'kick-tight', name: 'Tight Kick', category: 'Kicks' }
    ],
    snares: [
      { id: 'snare-808', name: '808 Snare', category: 'Snares' },
      { id: 'snare-acoustic', name: 'Acoustic Snare', category: 'Snares' },
      { id: 'snare-clap', name: 'Clap', category: 'Snares' },
      { id: 'snare-rim', name: 'Rim Shot', category: 'Snares' },
      { id: 'snare-tight', name: 'Tight Snare', category: 'Snares' },
      { id: 'snare-fat', name: 'Fat Snare', category: 'Snares' },
      { id: 'snare-crisp', name: 'Crisp Snare', category: 'Snares' },
      { id: 'snare-reverb', name: 'Reverb Snare', category: 'Snares' }
    ],
    hihats: [
      { id: 'hihat-closed', name: 'Closed Hi-Hat', category: 'Hi-Hats' },
      { id: 'hihat-open', name: 'Open Hi-Hat', category: 'Hi-Hats' },
      { id: 'hihat-pedal', name: 'Pedal Hi-Hat', category: 'Hi-Hats' },
      { id: 'hihat-tight', name: 'Tight Hi-Hat', category: 'Hi-Hats' },
      { id: 'hihat-loose', name: 'Loose Hi-Hat', category: 'Hi-Hats' },
      { id: 'hihat-sizzle', name: 'Sizzle Hi-Hat', category: 'Hi-Hats' }
    ],
    cymbals: [
      { id: 'crash', name: 'Crash Cymbal', category: 'Cymbals' },
      { id: 'ride', name: 'Ride Cymbal', category: 'Cymbals' },
      { id: 'splash', name: 'Splash Cymbal', category: 'Cymbals' },
      { id: 'china', name: 'China Cymbal', category: 'Cymbals' }
    ],
    toms: [
      { id: 'tom-low', name: 'Low Tom', category: 'Toms' },
      { id: 'tom-mid', name: 'Mid Tom', category: 'Toms' },
      { id: 'tom-high', name: 'High Tom', category: 'Toms' },
      { id: 'tom-floor', name: 'Floor Tom', category: 'Toms' }
    ],
    percussion: [
      { id: 'perc-shaker', name: 'Shaker', category: 'Percussion' },
      { id: 'perc-tambourine', name: 'Tambourine', category: 'Percussion' },
      { id: 'perc-cowbell', name: 'Cowbell', category: 'Percussion' },
      { id: 'perc-conga', name: 'Conga', category: 'Percussion' },
      { id: 'perc-bongo', name: 'Bongo', category: 'Percussion' },
      { id: 'perc-clave', name: 'Clave', category: 'Percussion' },
      { id: 'perc-woodblock', name: 'Woodblock', category: 'Percussion' },
      { id: 'perc-triangle', name: 'Triangle', category: 'Percussion' },
      { id: 'perc-maracas', name: 'Maracas', category: 'Percussion' }
    ],
    vocals: [
      { id: 'vocal-chop-male', name: 'Male Vocal Chop', category: 'Vocals' },
      { id: 'vocal-chop-female', name: 'Female Vocal Chop', category: 'Vocals' },
      { id: 'vocal-chop-pitched', name: 'Pitched Vocal Chop', category: 'Vocals' },
      { id: 'vocal-shot-hey', name: 'Hey Shot', category: 'Vocals' },
      { id: 'vocal-shot-yeah', name: 'Yeah Shot', category: 'Vocals' },
      { id: 'vocal-shot-uh', name: 'Uh Shot', category: 'Vocals' },
      { id: 'vocal-shot-oh', name: 'Oh Shot', category: 'Vocals' },
      { id: 'vocal-loop-ah', name: 'Ah Loop', category: 'Vocals' },
      { id: 'vocal-loop-oh', name: 'Oh Loop', category: 'Vocals' },
      { id: 'vocal-fx-reverse', name: 'Reverse Vocal', category: 'Vocals' },
      { id: 'vocal-fx-stutter', name: 'Stutter Vocal', category: 'Vocals' }
    ],
    bass: [
      { id: 'bass-sub', name: 'Sub Bass', category: 'Bass' },
      { id: 'bass-reese', name: 'Reese Bass', category: 'Bass' },
      { id: 'bass-fm', name: 'FM Bass', category: 'Bass' },
      { id: 'bass-acid', name: 'Acid Bass', category: 'Bass' },
      { id: 'bass-deep', name: 'Deep Bass', category: 'Bass' },
      { id: 'bass-wobble', name: 'Wobble Bass', category: 'Bass' },
      { id: 'bass-growl', name: 'Growl Bass', category: 'Bass' }
    ],
    leads: [
      { id: 'synth-lead-square', name: 'Square Lead', category: 'Leads' },
      { id: 'synth-lead-saw', name: 'Saw Lead', category: 'Leads' },
      { id: 'synth-lead-pluck', name: 'Pluck Lead', category: 'Leads' },
      { id: 'synth-lead-arp', name: 'Arp Lead', category: 'Leads' },
      { id: 'synth-lead-bell', name: 'Bell Lead', category: 'Leads' },
      { id: 'synth-lead-brass', name: 'Brass Lead', category: 'Leads' }
    ],
    pads: [
      { id: 'synth-pad-ambient', name: 'Ambient Pad', category: 'Pads' },
      { id: 'synth-pad-warm', name: 'Warm Pad', category: 'Pads' },
      { id: 'synth-pad-dark', name: 'Dark Pad', category: 'Pads' },
      { id: 'synth-pad-bright', name: 'Bright Pad', category: 'Pads' },
      { id: 'synth-pad-strings', name: 'String Pad', category: 'Pads' }
    ],
    synths: [
      { id: 'synth-bass', name: 'Bass Synth', category: 'Synths' },
      { id: 'synth-stab', name: 'Stab Synth', category: 'Synths' },
      { id: 'synth-chord', name: 'Chord Synth', category: 'Synths' }
    ],
    fx: [
      { id: 'fx-riser', name: 'Riser', category: 'FX' },
      { id: 'fx-impact', name: 'Impact', category: 'FX' },
      { id: 'fx-sweep', name: 'Sweep', category: 'FX' },
      { id: 'fx-noise', name: 'Noise', category: 'FX' }
    ]
  }

  const effectOptions = [
    { id: 'none', name: 'None', category: 'None' },
    { id: 'reverb', name: 'Reverb', category: 'Time-Based' },
    { id: 'delay', name: 'Delay', category: 'Time-Based' },
    { id: 'echo', name: 'Echo', category: 'Time-Based' },
    { id: 'chorus', name: 'Chorus', category: 'Modulation' },
    { id: 'flanger', name: 'Flanger', category: 'Modulation' },
    { id: 'phaser', name: 'Phaser', category: 'Modulation' },
    { id: 'distortion', name: 'Distortion', category: 'Distortion' },
    { id: 'overdrive', name: 'Overdrive', category: 'Distortion' },
    { id: 'bitcrush', name: 'Bitcrush', category: 'Distortion' },
    { id: 'filter-lp', name: 'Low-Pass Filter', category: 'Filters' },
    { id: 'filter-hp', name: 'High-Pass Filter', category: 'Filters' },
    { id: 'filter-bp', name: 'Band-Pass Filter', category: 'Filters' }
  ]

  const stepOptions = [2, 4, 8, 16, 32, 64]

  const presetKits = [
    { id: 'techno', name: 'Techno Kit' },
    { id: 'minimal-techno', name: 'Minimal Techno Kit' },
    { id: 'industrial-techno', name: 'Industrial Techno Kit' },
    { id: 'detroit-techno', name: 'Detroit Techno Kit' },
    { id: 'acid-techno', name: 'Acid Techno Kit' },
    { id: 'dnb', name: 'Drum & Bass Kit' },
    { id: 'ambient', name: 'Ambient Kit' },
    { id: 'trap', name: 'Trap Kit' },
    { id: 'house', name: 'House Kit' },
    { id: 'dubstep', name: 'Dubstep Kit' },
    { id: 'hiphop', name: 'Hip-Hop Kit' },
    { id: 'trance', name: 'Trance Kit' }
  ]

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Load custom sample
  const loadCustomSample = async (trackIndex, file) => {
    if (!file) return
    
    const arrayBuffer = await file.arrayBuffer()
    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
    
    const sampleId = `custom-${trackIndex}-${Date.now()}`
    customSamplesRef.current[sampleId] = audioBuffer
    
    const newTracks = [...tracks]
    newTracks[trackIndex].customSample = sampleId
    newTracks[trackIndex].instrument = 'custom'
    setTracks(newTracks)
  }

  // Reverse audio for selected track
  const reverseAudio = (trackIndex) => {
    const track = tracks[trackIndex]
    if (!track.customSample || !customSamplesRef.current[track.customSample]) {
      alert('Please upload a custom sample first!')
      return
    }

    const originalBuffer = customSamplesRef.current[track.customSample]
    const ctx = audioContextRef.current
    
    // Create a new reversed buffer
    const reversedBuffer = ctx.createBuffer(
      originalBuffer.numberOfChannels,
      originalBuffer.length,
      originalBuffer.sampleRate
    )
    
    for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
      const originalData = originalBuffer.getChannelData(channel)
      const reversedData = reversedBuffer.getChannelData(channel)
      
      for (let i = 0; i < originalBuffer.length; i++) {
        reversedData[i] = originalData[originalBuffer.length - 1 - i]
      }
    }
    
    // Store the reversed buffer
    const reversedSampleId = `reversed-${trackIndex}-${Date.now()}`
    customSamplesRef.current[reversedSampleId] = reversedBuffer
    
    const newTracks = [...tracks]
    newTracks[trackIndex].customSample = reversedSampleId
    setTracks(newTracks)
    
    alert('Audio reversed successfully!')
  }

  // Play custom sample
  const playCustomSample = (sampleId, time, track) => {
    const ctx = audioContextRef.current
    if (!ctx || !customSamplesRef.current[sampleId]) return

    const source = ctx.createBufferSource()
    source.buffer = customSamplesRef.current[sampleId]
    
    let destination = createEffectsChain(ctx, track)
    
    source.connect(destination)
    source.start(time)
  }

  // Create effects chain with EQ
  const createEffectsChain = (ctx, track) => {
    let destination = ctx.destination
    
    // EQ - 3-band equalizer
    const lowShelf = ctx.createBiquadFilter()
    lowShelf.type = 'lowshelf'
    lowShelf.frequency.value = 200
    lowShelf.gain.value = track.eqLow
    
    const midPeak = ctx.createBiquadFilter()
    midPeak.type = 'peaking'
    midPeak.frequency.value = 1000
    midPeak.Q.value = 1
    midPeak.gain.value = track.eqMid
    
    const highShelf = ctx.createBiquadFilter()
    highShelf.type = 'highshelf'
    highShelf.frequency.value = 3000
    highShelf.gain.value = track.eqHigh
    
    // Pan
    const panner = ctx.createStereoPanner()
    panner.pan.value = track.pan
    
    // Volume
    const gainNode = ctx.createGain()
    gainNode.gain.value = track.volume
    
    // Apply effects
    let effectNode = null
    const amount = track.effectAmount / 100
    
    if (track.effect === 'reverb') {
      const convolver = ctx.createConvolver()
      const reverbTime = 1 + amount * 2
      const sampleRate = ctx.sampleRate
      const length = sampleRate * reverbTime
      const impulse = ctx.createBuffer(2, length, sampleRate)
      for (let channel = 0; channel < 2; channel++) {
        const channelData = impulse.getChannelData(channel)
        for (let i = 0; i < length; i++) {
          channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
        }
      }
      convolver.buffer = impulse
      effectNode = convolver
    } else if (track.effect === 'delay' || track.effect === 'echo') {
      const delay = ctx.createDelay()
      delay.delayTime.value = 0.125 + amount * 0.375
      const feedback = ctx.createGain()
      feedback.gain.value = 0.2 + amount * 0.4
      delay.connect(feedback)
      feedback.connect(delay)
      effectNode = delay
    } else if (track.effect === 'distortion' || track.effect === 'overdrive') {
      const distortion = ctx.createWaveShaper()
      const distAmount = track.effect === 'overdrive' ? 10 + amount * 40 : 10 + amount * 90
      const samples = 44100
      const curve = new Float32Array(samples)
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1
        curve[i] = ((3 + distAmount) * x * 20) / (Math.PI + distAmount * Math.abs(x))
      }
      distortion.curve = curve
      effectNode = distortion
    } else if (track.effect.startsWith('filter-')) {
      const filter = ctx.createBiquadFilter()
      if (track.effect === 'filter-lp') {
        filter.type = 'lowpass'
        filter.frequency.value = 500 + amount * 4500
      } else if (track.effect === 'filter-hp') {
        filter.type = 'highpass'
        filter.frequency.value = 100 + amount * 2000
      } else if (track.effect === 'filter-bp') {
        filter.type = 'bandpass'
        filter.frequency.value = 500 + amount * 3000
      }
      filter.Q.value = 1 + amount * 9
      effectNode = filter
    } else if (track.effect === 'chorus') {
      const delay1 = ctx.createDelay()
      const delay2 = ctx.createDelay()
      delay1.delayTime.value = 0.015 + amount * 0.015
      delay2.delayTime.value = 0.025 + amount * 0.015
      const merger = ctx.createChannelMerger(2)
      delay1.connect(merger, 0, 0)
      delay2.connect(merger, 0, 1)
      effectNode = { input: delay1, output: merger, delay2 }
    } else if (track.effect === 'phaser' || track.effect === 'flanger') {
      const filter = ctx.createBiquadFilter()
      filter.type = 'allpass'
      filter.frequency.value = 500 + amount * 1500
      filter.Q.value = 1 + amount * 9
      effectNode = filter
    } else if (track.effect === 'bitcrush') {
      const bitDepth = Math.floor(16 - amount * 12)
      const crusher = ctx.createWaveShaper()
      const samples = 65536
      const curve = new Float32Array(samples)
      const step = Math.pow(0.5, bitDepth)
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1
        curve[i] = step * Math.floor(x / step + 0.5)
      }
      crusher.curve = curve
      effectNode = crusher
    }
    
    // Connect the chain
    if (effectNode) {
      if (effectNode.input) {
        lowShelf.connect(effectNode.input)
        effectNode.delay2.connect(effectNode.input)
        effectNode.output.connect(midPeak)
      } else {
        lowShelf.connect(effectNode)
        effectNode.connect(midPeak)
      }
    } else {
      lowShelf.connect(midPeak)
    }
    
    midPeak.connect(highShelf)
    highShelf.connect(panner)
    panner.connect(gainNode)
    gainNode.connect(destination)
    
    return lowShelf
  }

  // Synthesize sounds
  const createDrumSound = (type, time, track) => {
    const ctx = audioContextRef.current
    if (!ctx) return

    const now = time || ctx.currentTime
    let destination = createEffectsChain(ctx, track)

    // Kicks
    if (type.includes('kick')) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      let freqStart = 150
      let freqEnd = 40
      let duration = 0.5

      if (type === 'kick-trap') {
        freqStart = 120; freqEnd = 60; duration = 0.3
      } else if (type === 'kick-house') {
        freqStart = 100; freqEnd = 30; duration = 0.6
      } else if (type === 'kick-techno') {
        freqStart = 140; freqEnd = 45; duration = 0.5
      } else if (type === 'kick-distorted') {
        freqStart = 180; freqEnd = 50; duration = 0.4
      } else if (type === 'kick-punchy') {
        freqStart = 160; freqEnd = 55; duration = 0.35
      } else if (type === 'kick-deep') {
        freqStart = 90; freqEnd = 25; duration = 0.7
      } else if (type === 'kick-tight') {
        freqStart = 170; freqEnd = 65; duration = 0.25
      }

      osc.frequency.setValueAtTime(freqStart, now)
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration)
      
      gain.gain.setValueAtTime(1, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
      
      osc.connect(gain)

      if (type === 'kick-distorted') {
        const distortion = ctx.createWaveShaper()
        const amount = 50
        const samples = 44100
        const curve = new Float32Array(samples)
        for (let i = 0; i < samples; i++) {
          const x = (i * 2) / samples - 1
          curve[i] = ((3 + amount) * x * 20) / (Math.PI + amount * Math.abs(x))
        }
        distortion.curve = curve
        gain.connect(distortion)
        distortion.connect(destination)
      } else {
        gain.connect(destination)
      }
      
      osc.start(now)
      osc.stop(now + duration)
    }
    
    // Snares
    else if (type.includes('snare')) {
      const noise = ctx.createBufferSource()
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1
      }
      noise.buffer = buffer
      
      const noiseGain = ctx.createGain()
      const noiseFilter = ctx.createBiquadFilter()
      noiseFilter.type = 'highpass'
      noiseFilter.frequency.value = type === 'snare-crisp' ? 1500 : 1000
      
      noiseGain.gain.setValueAtTime(0.7, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
      
      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(destination)
      
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = type === 'snare-rim' ? 'square' : 'triangle'
      osc.frequency.setValueAtTime(type === 'snare-fat' ? 180 : 200, now)
      osc.frequency.exponentialRampToValueAtTime(type === 'snare-fat' ? 90 : 100, now + 0.1)
      
      oscGain.gain.setValueAtTime(0.3, now)
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
      
      osc.connect(oscGain)
      oscGain.connect(destination)
      
      noise.start(now)
      osc.start(now)
      osc.stop(now + 0.1)
    }
    
    // Hi-hats
    else if (type.includes('hihat')) {
      const noise = ctx.createBufferSource()
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1
      }
      noise.buffer = buffer
      
      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = type === 'hihat-sizzle' ? 12000 : 10000
      bandpass.Q.value = 1
      
      const highpass = ctx.createBiquadFilter()
      highpass.type = 'highpass'
      highpass.frequency.value = 7000
      
      const gain = ctx.createGain()
      const duration = type.includes('open') || type.includes('loose') ? 0.3 : 0.05
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
      
      noise.connect(bandpass)
      bandpass.connect(highpass)
      highpass.connect(gain)
      gain.connect(destination)
      
      noise.start(now)
    }
    
    // Cymbals
    else if (type.includes('crash') || type.includes('ride') || type.includes('splash') || type.includes('china')) {
      const noise = ctx.createBufferSource()
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < buffer.length; i++) {
        data[i] = Math.random() * 2 - 1
      }
      noise.buffer = buffer
      
      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.frequency.value = type === 'splash' ? 10000 : type === 'china' ? 6000 : 8000
      bandpass.Q.value = 0.5
      
      const gain = ctx.createGain()
      const duration = type === 'splash' ? 1 : 2
      gain.gain.setValueAtTime(0.5, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
      
      noise.connect(bandpass)
      bandpass.connect(gain)
      gain.connect(destination)
      
      noise.start(now)
    }
    
    // Toms
    else if (type.includes('tom')) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      const freq = type === 'tom-low' ? 80 : type === 'tom-mid' ? 120 : type === 'tom-high' ? 180 : 60
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, now + 0.3)
      
      gain.gain.setValueAtTime(0.8, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
      
      osc.connect(gain)
      gain.connect(destination)
      
      osc.start(now)
      osc.stop(now + 0.3)
    }
    
    // Percussion
    else if (type.includes('perc')) {
      if (type.includes('shaker') || type.includes('tambourine') || type.includes('maracas')) {
        const noise = ctx.createBufferSource()
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.1, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1
        }
        noise.buffer = buffer
        
        const highpass = ctx.createBiquadFilter()
        highpass.type = 'highpass'
        highpass.frequency.value = 5000
        
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1)
        
        noise.connect(highpass)
        highpass.connect(gain)
        gain.connect(destination)
        
        noise.start(now)
      } else {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'square'
        let freq = 200
        if (type.includes('cowbell')) freq = 800
        else if (type.includes('woodblock')) freq = 600
        else if (type.includes('clave')) freq = 1000
        else if (type.includes('triangle')) freq = 1200
        
        osc.frequency.setValueAtTime(freq, now)
        
        gain.gain.setValueAtTime(0.5, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15)
        
        osc.connect(gain)
        gain.connect(destination)
        
        osc.start(now)
        osc.stop(now + 0.15)
      }
    }
    
    // Vocals
    else if (type.includes('vocal')) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      
      filter.type = 'bandpass'
      filter.frequency.value = type.includes('male') ? 120 : 220
      filter.Q.value = 5
      
      osc.type = 'sawtooth'
      osc.frequency.value = type.includes('male') ? 120 : type.includes('female') ? 220 : 180
      
      let duration = 0.15
      if (type.includes('loop')) duration = 0.4
      
      gain.gain.setValueAtTime(0.4, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
      
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(destination)
      
      osc.start(now)
      osc.stop(now + duration)
    }
    
    // Bass
    else if (type.includes('bass')) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      
      filter.type = 'lowpass'
      filter.frequency.value = 300
      filter.Q.value = 5
      
      osc.type = type.includes('reese') || type.includes('growl') ? 'sawtooth' : 'sine'
      osc.frequency.value = type.includes('deep') ? 40 : 55
      
      const duration = 0.3
      gain.gain.setValueAtTime(0.5, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
      
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(destination)
      
      osc.start(now)
      osc.stop(now + duration)
    }
    
    // Leads & Pads
    else if (type.includes('synth')) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const filter = ctx.createBiquadFilter()
      
      filter.type = 'lowpass'
      filter.frequency.value = type.includes('pad') ? 800 : 1500
      filter.Q.value = 3
      
      if (type.includes('square')) osc.type = 'square'
      else if (type.includes('saw')) osc.type = 'sawtooth'
      else if (type.includes('bell')) osc.type = 'sine'
      else osc.type = 'triangle'
      
      osc.frequency.value = type.includes('pad') ? 220 : 440
      
      const duration = type.includes('pluck') ? 0.1 : type.includes('pad') ? 0.5 : 0.3
      gain.gain.setValueAtTime(0.3, now)
      gain.gain.exponentialRampToValueAtTime(0.01, now + duration)
      
      osc.connect(filter)
      filter.connect(gain)
      gain.connect(destination)
      
      osc.start(now)
      osc.stop(now + duration)
    }
    
    // FX
    else if (type.includes('fx')) {
      if (type === 'fx-noise') {
        const noise = ctx.createBufferSource()
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate)
        const data = buffer.getChannelData(0)
        for (let i = 0; i < buffer.length; i++) {
          data[i] = Math.random() * 2 - 1
        }
        noise.buffer = buffer
        
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        
        noise.connect(gain)
        gain.connect(destination)
        noise.start(now)
      } else {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'sawtooth'
        
        if (type === 'fx-riser') {
          osc.frequency.setValueAtTime(100, now)
          osc.frequency.exponentialRampToValueAtTime(2000, now + 1)
          gain.gain.setValueAtTime(0.1, now)
          gain.gain.linearRampToValueAtTime(0.4, now + 1)
        } else if (type === 'fx-impact') {
          osc.frequency.setValueAtTime(200, now)
          osc.frequency.exponentialRampToValueAtTime(40, now + 0.3)
          gain.gain.setValueAtTime(0.8, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3)
        } else if (type === 'fx-sweep') {
          osc.frequency.setValueAtTime(2000, now)
          osc.frequency.exponentialRampToValueAtTime(200, now + 0.5)
          gain.gain.setValueAtTime(0.3, now)
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5)
        }
        
        osc.connect(gain)
        gain.connect(destination)
        
        osc.start(now)
        osc.stop(now + 1)
      }
    }
  }

  // Scheduler
  const scheduleNote = (beatNumber, time) => {
    tracks.forEach((track) => {
      if (track.pattern[beatNumber % steps]) {
        if (track.customSample) {
          playCustomSample(track.customSample, time, track)
        } else {
          createDrumSound(track.instrument, time, track)
        }
      }
    })
  }

  const scheduler = () => {
    const ctx = audioContextRef.current
    if (!ctx) return

    while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
      scheduleNote(currentNoteRef.current, nextNoteTimeRef.current)
      
      const secondsPerBeat = 60.0 / bpm / 4
      const swingAmount = (swing / 100) * secondsPerBeat * 0.5
      const noteLength = currentNoteRef.current % 2 === 0 
        ? secondsPerBeat + swingAmount 
        : secondsPerBeat - swingAmount
      
      nextNoteTimeRef.current += noteLength
      currentNoteRef.current = (currentNoteRef.current + 1) % steps
      setCurrentStep(currentNoteRef.current)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      const ctx = audioContextRef.current
      if (ctx && ctx.state === 'suspended') {
        ctx.resume()
      }
      
      currentNoteRef.current = 0
      nextNoteTimeRef.current = ctx.currentTime
      
      schedulerRef.current = setInterval(scheduler, 25)
    } else {
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current)
      }
      setCurrentStep(0)
      currentNoteRef.current = 0
    }
    
    return () => {
      if (schedulerRef.current) {
        clearInterval(schedulerRef.current)
      }
    }
  }, [isPlaying, bpm, swing, steps, tracks])

  const toggleStep = (trackIndex, stepIndex) => {
    const newTracks = [...tracks]
    newTracks[trackIndex].pattern[stepIndex] = !newTracks[trackIndex].pattern[stepIndex]
    setTracks(newTracks)
  }

  const clearPattern = () => {
    const newTracks = tracks.map(track => ({
      ...track,
      pattern: Array(64).fill(false)
    }))
    setTracks(newTracks)
  }

  const generateAI = () => {
    const newTracks = tracks.map(track => ({
      ...track,
      pattern: Array(64).fill(false).map((_, i) => {
        if (track.name === 'Kick') return i % 4 === 0
        if (track.name === 'Snare') return i % 8 === 4
        if (track.name === 'Hi-Hat') return i % 2 === 0
        if (track.name === 'Vocal') return i % 16 === 8
        return Math.random() > 0.8
      })
    }))
    setTracks(newTracks)
  }

  const savePattern = () => {
    const data = {
      bpm,
      swing,
      steps,
      tracks: tracks.map(t => ({
        name: t.name,
        instrument: t.instrument,
        pattern: t.pattern.slice(0, steps),
        volume: t.volume,
        pan: t.pan,
        effect: t.effect,
        effectAmount: t.effectAmount,
        eqLow: t.eqLow,
        eqMid: t.eqMid,
        eqHigh: t.eqHigh
      }))
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'beatforge-pattern.json'
    a.click()
  }

  const loadPattern = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        setBpm(data.bpm || 120)
        setSwing(data.swing || 0)
        setSteps(data.steps || 16)
        
        const newTracks = tracks.map((track, i) => ({
          ...track,
          instrument: data.tracks[i]?.instrument || track.instrument,
          pattern: [...(data.tracks[i]?.pattern || []), ...Array(64).fill(false)].slice(0, 64),
          volume: data.tracks[i]?.volume ?? track.volume,
          pan: data.tracks[i]?.pan ?? track.pan,
          effect: data.tracks[i]?.effect || track.effect,
          effectAmount: data.tracks[i]?.effectAmount ?? track.effectAmount,
          eqLow: data.tracks[i]?.eqLow ?? track.eqLow,
          eqMid: data.tracks[i]?.eqMid ?? track.eqMid,
          eqHigh: data.tracks[i]?.eqHigh ?? track.eqHigh
        }))
        setTracks(newTracks)
      } catch (err) {
        console.error('Failed to load pattern:', err)
      }
    }
    reader.readAsText(file)
  }

  const loadPresetKit = (kitId) => {
    setSelectedKit(kitId)
    
    const kits = {
      techno: [
        { instrument: 'kick-techno', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-808', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-closed', pattern: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false] },
        { instrument: 'perc-shaker', pattern: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true] },
        { instrument: 'vocal-chop-pitched', pattern: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'synth-bass', pattern: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false] },
        { instrument: 'synth-lead-square', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'bass-sub', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] }
      ],
      'minimal-techno': [
        { instrument: 'kick-tight', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-crisp', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'hihat-closed', pattern: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true] },
        { instrument: 'perc-woodblock', pattern: [false, false, false, false, false, false, true, false, false, false, false, false, false, false, true, false] },
        { instrument: 'vocal-fx-stutter', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'synth-stab', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'synth-pad-ambient', pattern: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'bass-sub', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] }
      ],
      'industrial-techno': [
        { instrument: 'kick-distorted', pattern: [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true] },
        { instrument: 'snare-fat', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-open', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'perc-cowbell', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'vocal-fx-reverse', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'synth-stab', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'synth-pad-dark', pattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'bass-growl', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] }
      ],
      'detroit-techno': [
        { instrument: 'kick-techno', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-acoustic', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-closed', pattern: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false] },
        { instrument: 'perc-tambourine', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'vocal-chop-female', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'synth-lead-bell', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'synth-pad-warm', pattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'bass-fm', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] }
      ],
      'acid-techno': [
        { instrument: 'kick-punchy', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-808', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-closed', pattern: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] },
        { instrument: 'perc-clave', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'vocal-shot-uh', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] },
        { instrument: 'bass-acid', pattern: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false] },
        { instrument: 'synth-lead-saw', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'fx-noise', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] }
      ],
      trap: [
        { instrument: 'kick-trap', pattern: [true, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'snare-808', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-closed', pattern: [true, false, true, true, false, true, true, false, true, false, true, true, false, true, true, false] },
        { instrument: 'perc-shaker', pattern: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true] },
        { instrument: 'vocal-shot-hey', pattern: [false, false, false, false, false, false, false, true, false, false, false, false, false, false, false, true] },
        { instrument: 'bass-sub', pattern: [true, false, false, true, false, false, false, false, true, false, false, true, false, false, false, false] },
        { instrument: 'synth-lead-pluck', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'bass-wobble', pattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] }
      ],
      house: [
        { instrument: 'kick-house', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-clap', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-closed', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'perc-shaker', pattern: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] },
        { instrument: 'vocal-loop-oh', pattern: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'synth-bass', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'synth-pad-warm', pattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'bass-deep', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] }
      ],
      dubstep: [
        { instrument: 'kick-distorted', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-fat', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-open', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'perc-shaker', pattern: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true] },
        { instrument: 'vocal-fx-stutter', pattern: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'bass-wobble', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'synth-stab', pattern: [false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false] },
        { instrument: 'fx-impact', pattern: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] }
      ],
      hiphop: [
        { instrument: 'kick-808', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-clap', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-closed', pattern: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false] },
        { instrument: 'perc-tambourine', pattern: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true] },
        { instrument: 'vocal-shot-yeah', pattern: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'bass-sub', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'synth-pad-warm', pattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'fx-noise', pattern: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] }
      ],
      trance: [
        { instrument: 'kick-techno', pattern: [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false] },
        { instrument: 'snare-crisp', pattern: [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false] },
        { instrument: 'hihat-closed', pattern: [true, false, true, false, true, false, true, false, true, false, true, false, true, false, true, false] },
        { instrument: 'perc-shaker', pattern: [false, true, false, true, false, true, false, true, false, true, false, true, false, true, false, true] },
        { instrument: 'vocal-loop-ah', pattern: [false, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'synth-lead-saw', pattern: [true, false, false, true, false, false, true, false, true, false, false, true, false, false, true, false] },
        { instrument: 'synth-pad-bright', pattern: [true, false, false, false, false, false, false, false, true, false, false, false, false, false, false, false] },
        { instrument: 'fx-riser', pattern: [true, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false] }
      ]
    }
    
    const kit = kits[kitId] || kits.techno
    const newTracks = tracks.map((track, i) => ({
      ...track,
      instrument: kit[i]?.instrument || track.instrument,
      pattern: [...(kit[i]?.pattern || []), ...Array(64).fill(false)].slice(0, 64)
    }))
    setTracks(newTracks)
  }

  const updateTrackInstrument = (trackIndex, instrumentId) => {
    const newTracks = [...tracks]
    newTracks[trackIndex].instrument = instrumentId
    newTracks[trackIndex].customSample = null
    setTracks(newTracks)
  }

  const updateTrackEffect = (trackIndex, effectId) => {
    const newTracks = [...tracks]
    newTracks[trackIndex].effect = effectId
    setTracks(newTracks)
  }

  const updateTrackParameter = (trackIndex, parameter, value) => {
    const newTracks = [...tracks]
    newTracks[trackIndex][parameter] = value
    setTracks(newTracks)
  }

  // Get all instruments as flat list
  const allInstruments = [
    ...instrumentOptions.kicks,
    ...instrumentOptions.snares,
    ...instrumentOptions.hihats,
    ...instrumentOptions.cymbals,
    ...instrumentOptions.toms,
    ...instrumentOptions.percussion,
    ...instrumentOptions.vocals,
    ...instrumentOptions.bass,
    ...instrumentOptions.leads,
    ...instrumentOptions.pads,
    ...instrumentOptions.synths,
    ...instrumentOptions.fx
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 text-white p-4">
      <div className="max-w-[1800px] mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg"></div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              BeatForge Studio Pro
            </h1>
          </div>
          <p className="text-purple-300 text-lg">Professional Browser Beat Maker - 100+ Sounds</p>
        </div>

        {/* Visualizer */}
        <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 h-32">
          <div className="flex items-end justify-center gap-1 h-full">
            {Array.from({ length: 64 }).map((_, i) => (
              <div
                key={i}
                className={`w-3 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all duration-100 ${
                  isPlaying && i === currentStep ? 'opacity-100' : 'opacity-20'
                }`}
                style={{
                  height: isPlaying && i === currentStep ? `${50 + Math.random() * 50}%` : '10%'
                }}
              />
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
            >
              {isPlaying ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isPlaying ? 'Stop' : 'Play'}
            </Button>
            
            <Button
              onClick={clearPattern}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/20 gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear
            </Button>

            <div className="flex items-center gap-2">
              <label className="text-sm text-purple-300">BPM:</label>
              <input
                type="number"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-20 bg-black/40 border border-purple-500/30 rounded px-3 py-2 text-white"
                min="60"
                max="200"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-purple-300">Steps:</label>
              <select
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="bg-black/40 border border-purple-500/30 rounded px-3 py-2 text-white"
              >
                {stepOptions.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm text-purple-300">Swing:</label>
              <input
                type="range"
                value={swing}
                onChange={(e) => setSwing(Number(e.target.value))}
                className="w-32"
                min="0"
                max="100"
              />
              <span className="text-sm text-purple-300 w-12">{swing}%</span>
            </div>

            <Button
              onClick={generateAI}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Generate
            </Button>

            <Button
              onClick={() => setShowMixer(!showMixer)}
              variant="outline"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/20 gap-2"
            >
              <Sliders className="w-4 h-4" />
              {showMixer ? 'Hide' : 'Show'} Mixer
            </Button>

            <Button
              onClick={() => setShowRemixLive(!showRemixLive)}
              variant="outline"
              className="border-cyan-500 text-cyan-400 hover:bg-cyan-500/20 gap-2"
            >
              <AudioLines className="w-4 h-4" />
              {showRemixLive ? 'Hide' : 'Show'} RemixLive Studio
            </Button>

            <Button
              onClick={savePattern}
              variant="outline"
              className="border-green-500 text-green-400 hover:bg-green-500/20 gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>

            <label className="cursor-pointer">
              <Button
                variant="outline"
                className="border-orange-500 text-orange-400 hover:bg-orange-500/20 gap-2"
                asChild
              >
                <span>
                  <Upload className="w-4 h-4" />
                  Load Pattern (JSON)
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={loadPattern}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Preset Kits */}
        <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500/50 flex items-center justify-center">
              <span className="text-xs">🎵</span>
            </div>
            <h2 className="text-xl font-semibold text-cyan-300">Preset Kits</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {presetKits.map((kit) => (
              <Button
                key={kit.id}
                onClick={() => loadPresetKit(kit.id)}
                className={`${
                  selectedKit === kit.id
                    ? 'bg-cyan-600 hover:bg-cyan-700'
                    : 'bg-cyan-900/50 hover:bg-cyan-800/50'
                } border border-cyan-500/30`}
              >
                {kit.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Mixer Panel */}
        {showMixer && (
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sliders className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold text-yellow-300">Mixer & Effects</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {tracks.map((track, trackIndex) => (
                <div key={trackIndex} className="bg-black/40 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{track.name}</h3>
                    <label className="cursor-pointer">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-pink-500 text-pink-400 hover:bg-pink-500/20 h-7 px-2"
                        asChild
                      >
                        <span>
                          <Music className="w-3 h-3" />
                        </span>
                      </Button>
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => loadCustomSample(trackIndex, e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                  
                  {track.customSample && (
                    <div className="text-xs text-green-400">✓ Custom Sample</div>
                  )}
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-400">Volume</label>
                      <input
                        type="range"
                        value={track.volume * 100}
                        onChange={(e) => updateTrackParameter(trackIndex, 'volume', Number(e.target.value) / 100)}
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">Pan</label>
                      <input
                        type="range"
                        value={track.pan * 100}
                        onChange={(e) => updateTrackParameter(trackIndex, 'pan', Number(e.target.value) / 100)}
                        className="w-full"
                        min="-100"
                        max="100"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">EQ Low</label>
                      <input
                        type="range"
                        value={track.eqLow}
                        onChange={(e) => updateTrackParameter(trackIndex, 'eqLow', Number(e.target.value))}
                        className="w-full"
                        min="-12"
                        max="12"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">EQ Mid</label>
                      <input
                        type="range"
                        value={track.eqMid}
                        onChange={(e) => updateTrackParameter(trackIndex, 'eqMid', Number(e.target.value))}
                        className="w-full"
                        min="-12"
                        max="12"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">EQ High</label>
                      <input
                        type="range"
                        value={track.eqHigh}
                        onChange={(e) => updateTrackParameter(trackIndex, 'eqHigh', Number(e.target.value))}
                        className="w-full"
                        min="-12"
                        max="12"
                      />
                    </div>
                    
                    <div>
                      <label className="text-xs text-gray-400">Effect Amount</label>
                      <input
                        type="range"
                        value={track.effectAmount}
                        onChange={(e) => updateTrackParameter(trackIndex, 'effectAmount', Number(e.target.value))}
                        className="w-full"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RemixLive Studio Panel */}
        {showRemixLive && (
          <div className="bg-gradient-to-r from-indigo-900/30 to-cyan-900/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AudioLines className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-cyan-300">RemixLive Studio - Multitrack Editing</h2>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-cyan-300">Select Track:</label>
                <select
                  value={selectedTrackForEdit !== null ? selectedTrackForEdit : ''}
                  onChange={(e) => setSelectedTrackForEdit(e.target.value === '' ? null : Number(e.target.value))}
                  className="bg-black/40 border border-cyan-500/30 rounded px-3 py-2 text-white"
                >
                  <option value="">Choose a track...</option>
                  {tracks.map((track, index) => (
                    <option key={index} value={index}>{track.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Edit Audio */}
              <button className="bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <AudioWaveform className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Edit audio</span>
              </button>

              {/* Trim Audio */}
              <button className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Scissors className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Trim audio</span>
              </button>

              {/* Merge Audios */}
              <button className="bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Merge className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Merge audios</span>
              </button>

              {/* Split */}
              <button className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <SplitSquareHorizontal className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Split</span>
              </button>

              {/* Reverb */}
              <button className="bg-gradient-to-br from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">NEW</div>
                <Disc3 className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Reverb</span>
              </button>

              {/* Vocal Effects */}
              <button className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Shuffle className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Vocal Effects</span>
              </button>

              {/* Change Pitch */}
              <button className="bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Music className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Change pitch</span>
              </button>

              {/* Voice Changer */}
              <button className="bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <AudioLines className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Voice changer</span>
              </button>

              {/* Video to Audio */}
              <button className="bg-gradient-to-br from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Video className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Video to Audio</span>
              </button>

              {/* Edit Video */}
              <button className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Video className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Edit video</span>
              </button>

              {/* Set Volume */}
              <button className="bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Volume2 className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Set volume</span>
              </button>

              {/* Recording */}
              <button className="bg-gradient-to-br from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Mic className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Recording</span>
              </button>

              {/* Equalizer */}
              <button 
                onClick={() => {
                  if (selectedTrackForEdit === null) {
                    alert('Please select a track first!')
                  } else {
                    setShowMixer(true)
                    alert(`Mixer opened! Scroll down to adjust EQ for ${tracks[selectedTrackForEdit].name}`)
                  }
                }}
                className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg cursor-pointer"
              >
                <Settings2 className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Equalizer</span>
              </button>

              {/* Convert Audio */}
              <button className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Repeat className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Convert audio</span>
              </button>

              {/* Text to Speech */}
              <button className="bg-gradient-to-br from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <AudioWaveform className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Text to Speech</span>
              </button>

              {/* Remove Vocals */}
              <button className="bg-gradient-to-br from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg relative">
                <div className="absolute top-2 right-2 bg-orange-400 text-xs font-bold px-2 py-1 rounded">PRO</div>
                <Mic className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Remove vocals</span>
              </button>

              {/* Reverse Audio */}
              <button 
                onClick={() => {
                  if (selectedTrackForEdit === null) {
                    alert('Please select a track first!')
                  } else {
                    reverseAudio(selectedTrackForEdit)
                  }
                }}
                className="bg-gradient-to-br from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg cursor-pointer"
              >
                <Repeat className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Reverse audio</span>
              </button>

              {/* Insert Audio */}
              <button className="bg-gradient-to-br from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <FileAudio className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Insert audio</span>
              </button>

              {/* Audio Compression */}
              <button className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <FileAudio className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Audio compression</span>
              </button>

              {/* To Stereo */}
              <button className="bg-gradient-to-br from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <Volume2 className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">To stereo</span>
              </button>

              {/* Blank Audio */}
              <button className="bg-gradient-to-br from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all hover:scale-105 shadow-lg">
                <FileAudio className="w-10 h-10 text-white" />
                <span className="text-white font-semibold text-sm">Blank audio</span>
              </button>
            </div>
          </div>
        )}

        {/* Sequencer */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-purple-500/50 flex items-center justify-center">
              <span className="text-xs">🎹</span>
            </div>
            <h2 className="text-xl font-semibold text-purple-300">{steps}-Step Sequencer</h2>
          </div>
          
          <div className="space-y-2 overflow-x-auto">
            {tracks.map((track, trackIndex) => (
              <div key={trackIndex} className="flex items-center gap-2 min-w-max">
                <div className="w-24 text-sm font-medium text-purple-300 flex-shrink-0">
                  {track.name}
                </div>
                
                <select
                  value={track.customSample ? 'custom' : track.instrument}
                  onChange={(e) => updateTrackInstrument(trackIndex, e.target.value)}
                  className="w-48 bg-black/40 border border-purple-500/30 rounded px-2 py-1 text-xs text-white flex-shrink-0"
                  disabled={track.customSample}
                >
                  {track.customSample && <option value="custom">Custom Sample</option>}
                  {!track.customSample && Object.entries(instrumentOptions).map(([category, instruments]) => (
                    <optgroup key={category} label={category.toUpperCase()}>
                      {instruments.map(inst => (
                        <option key={inst.id} value={inst.id}>{inst.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>

                <select
                  value={track.effect}
                  onChange={(e) => updateTrackEffect(trackIndex, e.target.value)}
                  className="w-40 bg-black/40 border border-purple-500/30 rounded px-2 py-1 text-xs text-white flex-shrink-0"
                >
                  {effectOptions.map(eff => (
                    <option key={eff.id} value={eff.id}>{eff.name}</option>
                  ))}
                </select>
                
                <div className="flex gap-1">
                  {Array.from({ length: steps }).map((_, stepIndex) => {
                    const isActive = track.pattern[stepIndex]
                    const isCurrent = isPlaying && stepIndex === currentStep
                    
                    let bgColor = 'bg-gray-800/50'
                    if (isActive) {
                      const colors = [
                        'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-pink-500',
                        'bg-cyan-500', 'bg-orange-500', 'bg-purple-500', 'bg-red-500'
                      ]
                      bgColor = colors[trackIndex % colors.length]
                    }
                    
                    return (
                      <button
                        key={stepIndex}
                        onClick={() => toggleStep(trackIndex, stepIndex)}
                        className={`w-8 h-8 rounded ${bgColor} ${
                          isCurrent ? 'ring-2 ring-white' : ''
                        } hover:opacity-80 transition-all border border-purple-500/20 text-xs font-bold ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      >
                        {stepIndex + 1}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-purple-400 text-sm pb-4">
          Made with Manus • 100+ Instruments & Effects
        </div>
      </div>
    </div>
  )
}

export default App

