import Explorer from "@/components/explorer/Explorer";

const Explore = () => {
    return (
      <div >
          <h1 className="text-3xl my-5 text-center">Explore ZecHub</h1>
          <div className="flex flex-row md:flex-col">
            <Explorer />
          </div>
      </div>
    )
  }
  
  export default Explore;