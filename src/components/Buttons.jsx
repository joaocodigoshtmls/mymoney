import styles from './Buttons.module.css';

export default function Buttons() {
  return (
    <div>
      <button className={styles.botaoPrimario}>Salvar</button>
      <button className={styles.botaoSecundario}>Editar</button>
      <button className={styles.botaoPerigo}>Excluir</button>
    </div>
  );
}
