import React, { createElement, forwardRef } from 'react'

const motionPropNames = new Set([
  'animate',
  'custom',
  'drag',
  'dragConstraints',
  'dragElastic',
  'dragMomentum',
  'exit',
  'initial',
  'layout',
  'layoutId',
  'onAnimationComplete',
  'onAnimationStart',
  'onDrag',
  'onDragEnd',
  'onDragStart',
  'style',
  'transition',
  'variants',
  'viewport',
  'whileDrag',
  'whileFocus',
  'whileHover',
  'whileInView',
  'whileTap'
])

const omitMotionProps = (props) => {
  const nextProps = {}

  Object.entries(props).forEach(([key, value]) => {
    if (!motionPropNames.has(key)) {
      nextProps[key] = value
    }
  })

  return nextProps
}

const createStaticMotionComponent = (tag) =>
  forwardRef(({ children, ...props }, ref) =>
    createElement(tag, { ...omitMotionProps(props), ref }, children)
  )

const intrinsicComponents = new Map()
const customComponents = new WeakMap()

const getStaticMotionComponent = (component) => {
  const cache = typeof component === 'string' ? intrinsicComponents : customComponents
  if (!cache.has(component)) {
    cache.set(component, createStaticMotionComponent(component))
  }
  return cache.get(component)
}

const motionFactory = (component) => getStaticMotionComponent(component)

export const motion = new Proxy(motionFactory, {
  apply: (_target, _thisArg, [component]) => getStaticMotionComponent(component),
  get: (_target, tag) => getStaticMotionComponent(tag)
})

export const AnimatePresence = ({ children }) => <>{children}</>

export const useInView = () => true

export default motion
