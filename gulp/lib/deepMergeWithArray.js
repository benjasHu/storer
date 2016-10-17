import DeepMerge from 'deep-merge'

export default DeepMerge((target, source, key) => target instanceof Array ? [].concat(target, source): source)