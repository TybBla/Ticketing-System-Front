import { h, type FunctionalComponent } from 'vue'

interface StatusPillProps {
  label: string
  color: string
}

const StatusPill: FunctionalComponent<StatusPillProps> = (props) => {
  return h(
    'span',
    {
      class: ['status-pill', `status-pill--${props.color}`],
    },
    props.label,
  )
}

StatusPill.props = {
  label: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
}

export default StatusPill
