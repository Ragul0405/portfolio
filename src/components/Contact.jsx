import { useRef, useState } from 'react'
import emailjs from '@emailjs/browser'

import {
  FiMail,
  FiGithub,
  FiInstagram,
  FiFileText,
} from 'react-icons/fi'

import { FaLinkedinIn } from 'react-icons/fa'

const EMAIL = 'sankarrahul7373@gmail.com'

const LINKEDIN = 'https://www.linkedin.com/in/ragul-sankar/'

const GITHUB = 'https://github.com/ragul0405'

const INSTAGRAM = 'https://www.instagram.com/___ragul___s?igsh=azMxdjRpNGQ4NHlh&utm_source=qr'

const RESUME = `${import.meta.env.BASE_URL}Ragul_Resume.pdf`

const SERVICE_ID = 'service_lr0mlsm'
const TEMPLATE_ID = 'template_x4nyy7b'
const PUBLIC_KEY = 'OM7spFgQ1B1fXoMa9'

const labelCls =
  'pointer-events-none absolute left-4 top-2 font-mono text-[0.68rem] uppercase tracking-wider text-accent transition-all ' +
  'peer-placeholder-shown:top-4 peer-placeholder-shown:font-body peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-muted ' +
  'peer-focus:top-2 peer-focus:font-mono peer-focus:text-[0.68rem] peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-accent'

const inputCls =
  'field-input peer w-full rounded-[11px] border border-line bg-surface px-4 pb-2 pt-5 text-[1rem] text-text transition-colors'

const socialCls =
  'group flex h-[52px] w-[52px] items-center justify-center rounded-full border border-line bg-surface text-[1.1rem] text-muted transition-all duration-300 hover:-translate-y-[4px] hover:border-accent hover:text-accent hover:shadow-[0_12px_30px_-12px_var(--accent)]'

export default function Contact() {
  const formRef = useRef()

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [note, setNote] = useState({
    text: '',
    type: '',
  })

  const update =
    (k) =>
    (e) =>
      setForm((f) => ({
        ...f,
        [k]: e.target.value,
      }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { name, email, message } = form

    if (!name.trim() || !email.trim() || !message.trim()) {
      setNote({
        text: 'Please fill in every field.',
        type: 'err',
      })

      return
    }

    setNote({
      text: 'Sending message...',
      type: '',
    })

    try {
      await emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        formRef.current,
        PUBLIC_KEY
      )

      setForm({
        name: '',
        email: '',
        message: '',
      })

      setNote({
        text: '✓ Message sent successfully.',
        type: 'ok',
      })
    } catch (error) {
      setNote({
        text: 'Something went wrong. Please try again.',
        type: 'err',
      })
    }
  }

  return (
    <section
      id="contact"
      className="relative z-[2] py-[130px_0_90px] pb-[90px] pt-[130px] text-center"
    >
      <div className="mx-auto max-w-content px-8">

        <span className="font-mono text-[0.74rem] uppercase tracking-[0.14em] text-accent">
          Get in touch
        </span>

        <h2 className="mx-auto my-[16px] mb-3 font-display text-[clamp(2.2rem,6.5vw,4.4rem)] font-extrabold leading-[1.03] tracking-[-0.03em]">
          Let’s build
          <br />

          <em className="grad-text not-italic">
            something great.
          </em>
        </h2>

        <p className="mx-auto mb-[44px] max-w-[460px] text-muted">
          Currently available for backend development roles and freelance opportunities.
        </p>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto grid max-w-[560px] gap-[18px] text-left"
        >
          <div className="relative">
            <input
              id="f-name"
              name="name"
              value={form.name}
              onChange={update('name')}
              placeholder=" "
              className={inputCls}
            />

            <label htmlFor="f-name" className={labelCls}>
              Your name
            </label>
          </div>

          <div className="relative">
            <input
              id="f-email"
              name="email"
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder=" "
              className={inputCls}
            />

            <label htmlFor="f-email" className={labelCls}>
              Email address
            </label>
          </div>

          <div className="relative">
            <textarea
              id="f-msg"
              name="message"
              value={form.message}
              onChange={update('message')}
              placeholder=" "
              className={`${inputCls} min-h-[120px] resize-y`}
            />

            <label htmlFor="f-msg" className={labelCls}>
              Message
            </label>
          </div>

          <button
            type="submit"
            className="w-full rounded-[10px] bg-accent px-[26px] py-4 text-[0.92rem] font-semibold text-white transition-transform duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_30px_-10px_var(--accent)]"
          >
            Send message
          </button>

          <p
            className={`min-h-[22px] text-center font-mono text-[0.92rem] ${
              note.type === 'ok'
                ? 'text-accent'
                : note.type === 'err'
                ? 'text-accent-2'
                : 'text-muted'
            }`}
          >
            {note.text}
          </p>
        </form>

        {/* Social Icons */}

        <div className="mt-[40px] flex items-center justify-center gap-5">

          <a
            href={`mailto:${EMAIL}`}
            className={socialCls}
          >
            <FiMail />
          </a>

          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className={socialCls}
          >
            <FaLinkedinIn />
          </a>

          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className={socialCls}
          >
            <FiGithub />
          </a>

          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noreferrer"
            className={socialCls}
          >
            <FiInstagram />
          </a>

          <a
            href={RESUME}
            target="_blank"
            rel="noreferrer"
            className={socialCls}
          >
            <FiFileText />
          </a>

        </div>
      </div>
    </section>
  )
}