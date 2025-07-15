import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', () => {
  const searchTerm = ref('');
  const selectedDepartments = ref<number[]>([]);
  const fetchParams = ref<{ count: number; query?: string; departments?: number[] } | null>(null);

  function setSearchTerm(term: string) {
    searchTerm.value = term;
  }

  function setSelectedDepartments(departments: number[]) {
    selectedDepartments.value = departments;
  }

  function setFetchParams(params: { count: number; query?: string; departments?: number[] }) {
    fetchParams.value = params;
  }

  function clearFetchParams() {
    fetchParams.value = null;
  }

  return {
    searchTerm,
    selectedDepartments,
    fetchParams,
    setSearchTerm,
    setSelectedDepartments,
    setFetchParams,
    clearFetchParams,
  };
});
