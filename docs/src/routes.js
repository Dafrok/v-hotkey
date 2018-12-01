import Step1 from './pages/step-1.vue'
import Step2 from './pages/step-2.vue'
import Step3 from './pages/step-3.vue'
import Step4 from './pages/step-4.vue'
import Step5 from './pages/step-5.vue'
import Step6 from './pages/step-6.vue'
import Step7 from './pages/step-7.vue'
import Start from './pages/start.vue'
import Step from './pages/step.vue'

export default [
  {
    path: '/',
    alias: '/start',
    component: Start
  },
  {
    path: '/step',
    component: Step,
    children: [
      {
        path: '1',
        component: Step1
      },
      {
        path: '2',
        component: Step2
      },
      {
        path: '3',
        component: Step3
      },
      {
        path: '4',
        component: Step4
      },
      {
        path: '5',
        component: Step5
      },
      {
        path: '6',
        component: Step6
      },
      {
        path: '7',
        component: Step7
      }
    ]
  }
]
