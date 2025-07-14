import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', () => {
  const searchTerm = ref('');
  const selectedDepartments = ref<number[]>([]);

  function setSearchTerm(term: string) {
    searchTerm.value = term;
  }

  function setSelectedDepartments(departments: number[]) {
    selectedDepartments.value = departments;
  }

  return {
    searchTerm,
    selectedDepartments,
    setSearchTerm,
    setSelectedDepartments,
  };
});
