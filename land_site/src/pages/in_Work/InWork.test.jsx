import { describe, expect, it, vi } from 'vitest'
import { screen, within } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import InWork from './InWork'
import projects from './projectsData'
import { translations } from '../../i18n/translations'
import { renderWithProviders } from '../../test/renderWithProviders'

vi.mock('../../motion/gsap', () => import('../../test/gsapMock'))

const en = translations.en
const titleOf = (project) => project.titleKey.split('.').reduce((node, key) => node[key], en)
const renderCase = (id) =>
  renderWithProviders(
    <Routes>
      <Route path="/works/:id" element={<InWork />} />
    </Routes>,
    { route: `/works/${id}` }
  )

describe('InWork (case study)', () => {
  it('shows the project title as the page heading and the narrative for case-study projects', () => {
    const project = projects.find((p) => p.caseKeys)
    renderCase(project.id)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(titleOf(project))
    for (const part of ['problem', 'solution', 'stack', 'result']) {
      expect(screen.getByRole('heading', { level: 2, name: en.works.case[part] })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: 'All works' })).toHaveAttribute('href', '/works')
  })

  it('skips the narrative for projects without case keys', () => {
    const project = projects.find((p) => !p.caseKeys)
    renderCase(project.id)
    expect(screen.queryByRole('heading', { level: 2, name: en.works.case.problem })).toBeNull()
  })

  it('lists technologies and links to the source code', () => {
    const project = projects.find((p) => p.github && p.technologies?.length)
    renderCase(project.id)
    for (const tech of project.technologies) {
      expect(screen.getByText(tech.name)).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /Source code/ })).toHaveAttribute('href', project.github)
  })

  it('links the last project to the first one as "next"', () => {
    const last = projects.at(-1)
    renderCase(last.id)
    expect(screen.getByRole('link', { name: /Next project/ })).toHaveAttribute('href', `/works/${projects[0].id}`)
  })

  it('renders the 404 page for an unknown id', () => {
    renderCase('no-such-project')
    expect(screen.getByRole('heading', { level: 1, name: en.notFound.title })).toBeInTheDocument()
  })
})

// Extra guarantees beyond the brief (qa-yennefer).
const titleIn = (lang, project) =>
  project.titleKey.split('.').reduce((node, key) => node[key], translations[lang])

const renderCaseIn = (lang, id) => {
  localStorage.setItem('bc_lang', lang)
  return renderCase(id)
}

describe('InWork (case study) — contract details', () => {
  it.each(projects.map((p) => [p.id, p]))(
    '%s: exactly one h1, inside <main>, carrying the project title',
    (_id, project) => {
      renderCase(project.id)
      const headings = document.querySelectorAll('h1')
      expect(headings).toHaveLength(1)
      expect(document.querySelectorAll('main h1')).toHaveLength(1)
      expect(headings[0]).toHaveTextContent(titleOf(project))
    }
  )

  it('links each middle project to the one right after it (no wrap)', () => {
    renderCase(projects[0].id)
    expect(screen.getByRole('link', { name: /Next project/ })).toHaveAttribute('href', `/works/${projects[1].id}`)
  })

  it('shows the next project title inside the "next" link', () => {
    const last = projects.at(-1)
    renderCase(last.id)
    expect(screen.getByRole('link', { name: /Next project/ })).toHaveTextContent(titleOf(projects[0]))
  })

  it('renders every narrative part text and labels them as h2, never h3', () => {
    const project = projects.find((p) => p.caseKeys)
    const { container } = renderCase(project.id)
    for (const part of ['problem', 'solution', 'stack', 'result']) {
      const text = project.caseKeys[part].split('.').reduce((node, key) => node[key], en)
      expect(screen.getByText(text)).toBeInTheDocument()
    }
    expect(container.querySelectorAll('h3')).toHaveLength(0)
  })

  it('renders no narrative part at all when caseKeys are absent', () => {
    const project = projects.find((p) => !p.caseKeys)
    renderCase(project.id)
    for (const part of ['problem', 'solution', 'stack', 'result']) {
      expect(screen.queryByRole('heading', { name: en.works.case[part] })).toBeNull()
    }
  })

  it('opens the source code in a new tab without leaking the opener', () => {
    const project = projects.find((p) => p.github)
    renderCase(project.id)
    const link = screen.getByRole('link', { name: /Source code/ })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.getAttribute('rel')?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']))
  })

  it('shows only the live-site link when the project has a siteUrl and no github', () => {
    const project = projects.find((p) => p.siteUrl && !p.github)
    renderCase(project.id)
    const live = screen.getByRole('link', { name: /Live site/ })
    expect(live).toHaveAttribute('href', project.siteUrl)
    expect(live).toHaveAttribute('target', '_blank')
    expect(live.getAttribute('rel')?.split(/\s+/)).toEqual(expect.arrayContaining(['noopener', 'noreferrer']))
    expect(screen.queryByRole('link', { name: /Source code/ })).toBeNull()
    expect(screen.queryByText(/Source code/)).toBeNull()
  })

  it('shows only the source-code link when the project has github and no siteUrl', () => {
    const project = projects.find((p) => p.github && !p.siteUrl)
    renderCase(project.id)
    expect(screen.getByRole('link', { name: /Source code/ })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Live site/ })).toBeNull()
    expect(screen.queryByText(/Live site/)).toBeNull()
  })

  it('shows no links row when the project has neither siteUrl nor github', () => {
    const project = projects.find((p) => !p.siteUrl && !p.github)
    renderCase(project.id)
    expect(screen.queryByText(en.works.case.links)).toBeNull()
    expect(screen.queryByRole('link', { name: /Live site|Source code/ })).toBeNull()
  })

  it('uses images[0] once as the titled hero and the rest as the gallery', () => {
    const project = projects.find((p) => p.images.length > 2)
    const { container } = renderCase(project.id)
    const title = titleOf(project)
    const hero = screen.getByRole('img', { name: title })
    expect(hero).toHaveAttribute('src', project.images[0])
    const srcs = [...container.querySelectorAll('img')].map((img) => img.getAttribute('src'))
    for (const src of project.images) {
      expect(srcs.filter((s) => s === src)).toHaveLength(1)
    }
    const gallery = screen.getByRole('region', { name: en.works.case.gallery })
    const galleryImgs = within(gallery).getAllByRole('img')
    expect(galleryImgs.map((img) => img.getAttribute('src'))).toEqual(project.images.slice(1))
    galleryImgs.forEach((img) => expect(img.getAttribute('alt')).toBeTruthy())
  })

  it('renders no gallery for a single-image project', () => {
    const project = projects.find((p) => p.images.length === 1)
    renderCase(project.id)
    expect(screen.queryByRole('region', { name: en.works.case.gallery })).toBeNull()
  })

  it('renders case labels, back and next links in Hebrew', () => {
    const he = translations.he
    const project = projects.find((p) => p.caseKeys)
    renderCaseIn('he', project.id)
    for (const part of ['problem', 'solution', 'stack', 'result']) {
      expect(screen.getByRole('heading', { level: 2, name: he.works.case[part] })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: he.works.case.back })).toHaveAttribute('href', '/works')
    expect(screen.getByRole('link', { name: new RegExp(he.works.case.next) })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: new RegExp(he.works.case.github) })).toHaveAttribute('href', project.github)
    expect(screen.queryByText(en.works.case.back)).toBeNull()
    expect(screen.queryByText(en.works.case.next)).toBeNull()
  })

  it('keeps the Russian title with its soft hyphen intact in the heading', () => {
    const project = projects.find((p) => titleIn('ru', p).includes('­'))
    expect(project).toBeDefined()
    renderCaseIn('ru', project.id)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(titleIn('ru', project))
    expect(screen.getByRole('link', { name: translations.ru.works.case.back })).toHaveAttribute('href', '/works')
  })
})
