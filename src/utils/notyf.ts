import { Notyf, type INotyfOptions } from 'notyf'

const notyfObj: Partial<INotyfOptions> = {
  types: [
    {
      backgroundColor: 'var(--main-prim)',
      icon: {
        color: 'var(--bs-white)',
        className: 'pi pi-exclamation-circle',
        tagName: 'i',
      },
    },
  ],
}

const notyf = new Notyf(notyfObj)

export default notyf

export const error = (error: unknown) => {
  notyf.open({
    message: "<b>Something's wrong!</b><br /> Please try again later.",
    duration: 3000,
  })
  console.error(error)
}
