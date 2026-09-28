import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import OwnerPhoto from './OwnerPhoto.comp'
import { MASCOT_IMAGE, OWNER_PHOTO } from '../../config/owner'

describe('OwnerPhoto', () => {
  it('shows the owner photo', () => {
    render(<OwnerPhoto alt="Portrait of the owner" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', OWNER_PHOTO)
    expect(screen.getByRole('img')).toHaveAccessibleName('Portrait of the owner')
  })

  it('falls back to the mascot when the photo fails to load', () => {
    render(<OwnerPhoto alt="Portrait of the owner" />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByRole('img')).toHaveAttribute('src', MASCOT_IMAGE)
    expect(screen.getByRole('img')).toHaveAccessibleName('Blue Cat')
  })

  it('does not loop if the mascot also fails', () => {
    render(<OwnerPhoto alt="Portrait of the owner" />)
    fireEvent.error(screen.getByRole('img'))
    fireEvent.error(screen.getByRole('img'))
    expect(screen.getByRole('img')).toHaveAttribute('src', MASCOT_IMAGE)
  })

  it('passes className through', () => {
    render(<OwnerPhoto alt="x" className="about-photo" />)
    expect(screen.getByRole('img')).toHaveClass('owner-photo', 'about-photo')
  })
})
