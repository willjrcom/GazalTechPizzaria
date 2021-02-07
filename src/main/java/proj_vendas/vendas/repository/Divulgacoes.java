package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Divulgar;

@Transactional(readOnly = true) //evitar duplo acesso ao banco
public interface Divulgacoes extends JpaRepository<Divulgar, Long>{

}
