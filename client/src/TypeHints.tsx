interface NullFunction {
  (): void;
}

const amd: NullFunction = () => {
  const a = 2;
  console.log(a);
  return;
};

amd();
