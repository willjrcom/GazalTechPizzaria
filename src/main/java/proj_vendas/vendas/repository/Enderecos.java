package proj_vendas.vendas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import proj_vendas.vendas.model.Endereco;

@Transactional(readOnly = true)
@Repository
public interface Enderecos extends JpaRepository<Endereco, Long>{

}
