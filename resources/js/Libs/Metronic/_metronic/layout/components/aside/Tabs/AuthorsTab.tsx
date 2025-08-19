import {Link} from 'react-router-dom'
import {toAbsoluteUrl} from '../../../../helpers'

const authors: ReadonlyArray<{
  avatar: string
  name: string
  description: string
}> = [
  {
    avatar: 'media/avatars/300-6.jpg',
    name: 'Emma Smith',
    description: '10 Satış',
  },

  {
    avatar: 'media/avatars/300-5.jpg',
    name: 'Sean Bean',
    description: '7 Satış',
  },

  {
    avatar: 'media/avatars/300-11.jpg',
    name: 'Brian Cox',
    description: '6 Satış',
  },

  {
    avatar: 'media/avatars/300-23.jpg',
    name: 'Dan Wilson',
    description: '6 Satış',
  },

  {
    avatar: 'media/avatars/300-10.jpg',
    name: 'Natali Trump',
    description: '4 Satış',
  },

  {
    avatar: 'media/avatars/300-9.jpg',
    name: 'Francis Mitcham',
    description: '2 Satış',
  },

  {
    avatar: 'media/avatars/300-12.jpg',
    name: 'Jessie Clarcson',
    description: '1 Satış',
  },
]

const AuthorsTab = () => (
  <div className='mx-5'>
    {/*begin::Header*/}
    <h3 className='fw-bolder text-gray-900 mx-0 mb-10'>Satış Temsilcileri</h3>
    {/*end::Header*/}

    {/*begin::Body*/}
    <div className='mb-12'>
      {authors.map((a) => (
        <div className='d-flex align-items-center mb-7' key={a.name}>
          {/*begin::Avatar*/}
          <div className='symbol symbol-50px me-5'>
            <img src={toAbsoluteUrl(a.avatar)} className='' alt='' />
          </div>
          {/*end::Avatar*/}

          {/*begin::Text*/}
          <div className='flex-grow-1'>
            <Link
              to='/crafted/account/overview'
              className='text-gray-900 fw-bolder text-hover-primary fs-6'
            >
              {a.name}
            </Link>
            <span className='text-muted d-block fw-bold'>{a.description}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export {AuthorsTab}
