package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Conquista;

@Transactional(readOnly = true) //evitar duplo acesso ao banco
public interface Conquistas extends JpaRepository<Conquista, Long>{

	public Conquista findByCodEmpresa(int codEmpresa);
}
