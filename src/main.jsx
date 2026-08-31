import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
/* dynamic-subset: 화면에 쓰인 글자 범위(unicode-range 조각)만 내려받는다.
   풀 버전(pretendardvariable.css)은 단일 2MB woff2라 첫 로드가 무겁다. */
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@fontsource-variable/outfit'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
