type LoadingErrorProps = {
  message: string;
};
export default function LoadingError(props: LoadingErrorProps) {
  return (
    <div style={{ width: "100%", minWidth: "100%" }}>
      <p>
        <i>{props.message} </i>
      </p>
    </div>
  );
}
