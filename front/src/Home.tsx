function Home() {
  return (
    <>
      <div className="w-full flex justify-center py-10 px-1 space-x-10 text-[24px]">
        <a className="border-[1px] px-8 py-3 rounded-md" href="/historic">Archive game</a>
        <a className="border-[1px] px-8 py-3 rounded-md" href="/llm">LMM generated game</a>
      </div>
    </>
  );
}

export default Home;
