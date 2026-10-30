
export function StageAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(180deg,#141013_0%,#0D090B_45%,#080607_100%)]" />


      <div className="absolute inset-0 bg-[radial-gradient(70rem_45rem_at_50%_-10%,rgba(212,175,55,0.10),transparent_65%)]" />


      <div className="absolute inset-0 bg-[radial-gradient(60rem_35rem_at_50%_115%,rgba(74,20,32,0.30),transparent_70%)]" />


      <div className="absolute inset-0 bg-[radial-gradient(45rem_60rem_at_-10%_50%,rgba(6,8,14,0.55),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(45rem_60rem_at_110%_50%,rgba(6,8,14,0.55),transparent_60%)]" />


      <div className="absolute inset-0 opacity-[0.5] bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.016)_0px,rgba(255,255,255,0.016)_1px,transparent_1px,transparent_7px,rgba(0,0,0,0.05)_7px,rgba(0,0,0,0.05)_8px,transparent_8px,transparent_15px)]" />


      <div className="stage-drift absolute -top-1/4 left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(242,200,121,0.07),transparent_62%)] blur-3xl" />
    </div>
  )
}
