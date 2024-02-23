import Image from 'next/image'
import projects from './projects.json'
import Link from 'next/link'

export default function PageLayout() {
  return (
    <div className='py-10'>
      <header
        className='relative mx-auto mb-12'
        style={{
          maxWidth: 'min(80vw,1024px)'
        }}
      >
        <div className='mx-12 flex flex-row justify-center'>
          <h1 className='text-4xl'>
            <strong className='font-bold'>react three fiber</strong>
            {' demos'}
          </h1>
        </div>
      </header>
      <main>
        <div
          className='mx-auto'
          style={{
            maxWidth: 'min(80vw,1024px)'
          }}
        >
          <div className='flex flex-wrap justify-between gap-8'>
            {projects.map((project) => (
              <div
                key={project.slug}
                className='h-[480px] w-[300px] rounded-md shadow-lg duration-300 hover:scale-105'
              >
                <Image
                  className='rounded-t-md'
                  src={`/${project.slug}/thumbnail.png`}
                  alt={project.slug}
                  width={300}
                  height={300}
                />
                <div className='flex h-[calc(100%-300px)] flex-col justify-between p-4'>
                  <h2 className='text-xl font-bold'>{project.name}</h2>
                  <div className='flex flex-col justify-end gap-2'>
                    <Link
                      href={project.slug}
                      className='inline-flex h-10 w-full items-center justify-center rounded-lg bg-black text-center text-sm text-white'
                    >
                      Open Code
                    </Link>
                    <Link
                      href={project.slug}
                      className='inline-flex h-10 w-full items-center justify-center rounded-lg bg-indigo-500 text-center text-sm text-white'
                    >
                      Open Project
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
